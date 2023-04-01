const { expectTxnSuccess, expectTxnRevertWith } = require("./helpers/txn");

const BlockMenu = artifacts.require("BlockMenu");

contract("BlockMenu > Billable", (accounts) => {
  let blockMenu;

  before(async function () {
    blockMenu = await BlockMenu.deployed();
  });

  const owner = accounts[0];

  const expectBillTotalAmount = async (billId, totalAmount) => {
    const billAmountRes = await blockMenu.getBillTotalAmount(billId);
    expect(billAmountRes.valueOf().toNumber()).to.be.equal(totalAmount);
  }

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await blockMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  describe("createBill", () => {
    it("should not create the bill when the menu is not ready", async () => {
      await expectTxnRevertWith(
        blockMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] }),
        "menu is not ready"
      );
    });
    it("should create the bill properly", async () => {
      const menuParams = ["MY_METADATA_CID", [[100], [200]]];
      await expectTxnSuccess(blockMenu.createMenu(menuParams, { from: owner }));

      // Should create successfully the first bill
      await expectTxnSuccess(
        blockMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] })
      );

      // Should thrown error for second bill since the first bill is still active
      await expectTxnRevertWith(
        blockMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] }),
        "current bill is still active"
      );
    });
  });

  describe("createOrder", () => {
    it("should throw error if an menuItemIdx does not exist on menu", async () => {
      await expectTxnSuccess(
        blockMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[5] })
      );
      await expectTxnRevertWith(
        blockMenu.createOrder(
          [
            [
              [999, 2],
              [2, 3],
            ],
          ],
          {
            from: accounts[5],
          }
        ),
        'item not in menu',
      );
    });
    it("should create order properly", async () => {
      // Should create successfully the first bill
      await expectTxnSuccess(
        blockMenu.createOrder(
          [
            [
              [0, 2],
              [1, 3],
            ],
          ],
          {
            from: accounts[5],
          }
        )
      );
      const orderInfos = await blockMenu.getLatestOrderInfos({
        from: accounts[5],
      });
      expect(orderInfos).to.have.length(1);
      const [orderInfo] = orderInfos;
      expect(orderInfo.id.toNumber()).to.be.equal(1);
      expect(orderInfo.bill.owner).to.be.equal(
        tronWeb.address.toHex(accounts[5])
      );
      expect(orderInfo.lines).to.have.length(2);
      expect(orderInfo.lines[0].menuItemIdx.toNumber()).to.be.equal(0);
      expect(orderInfo.lines[0].quantity.toNumber()).to.be.equal(2);
      expect(orderInfo.lines[1].menuItemIdx.toNumber()).to.be.equal(1);
      expect(orderInfo.lines[1].quantity.toNumber()).to.be.equal(3);

      await expectBillTotalAmount(orderInfo.bill.id.toNumber(), 800);
    });
  });
  describe('payBill', () => {
    const createPayableBill = async (from) => {
      await blockMenu.createBill("MY_BILL_METADATA_CID", { from });
      const currentBill = await blockMenu.getAccountCurrentBill(from);
      await blockMenu.createOrder(
        [
          [
            [0, 2],
            [1, 3],
          ],
        ],
        {
          from,
        }
      );
      return currentBill.id.toNumber();
    }
    it('with insufficient value', async () => {
      const billId = await createPayableBill(accounts[8]);
      await expectBillTotalAmount(billId, 800);
      await expectTxnRevertWith(
        blockMenu.payBill(billId, { from: accounts[8], callValue: 700 }),
        'insufficient value',
      );
    });
    it('with exact value', async () => {
      const billId = await createPayableBill(accounts[6]);
      await expectBillTotalAmount(billId, 800);
      await expectTxnSuccess(
        blockMenu.payBill(billId, { from: accounts[6], callValue: 800 }),
      );
    });
    it('overpaid (no waiter assigned)', async () => {
      const billId = await createPayableBill(accounts[6]);
      await expectBillTotalAmount(billId, 800);
      await expectTxnSuccess(
        blockMenu.payBill(billId, { from: accounts[6], callValue: 850 }),
      );
    });
    it('overpaid when waiter is assigned (tips)', async () => {
      const billId = await createPayableBill(accounts[6]);
      // Creating Waiter and Assigning to bill
      const waiter = accounts[7];
      await blockMenu.addMember(waiter, 0x02, { from: owner });
      await blockMenu.assignWaiterToBill(billId, waiter, { from: owner });
      const waiterBalanceBefore = await tronWrap.trx.getBalance(waiter);
      await expectBillTotalAmount(billId, 800);
      await expectTxnSuccess(
        blockMenu.payBill(billId, { from: accounts[6], callValue: 850 }),
      );
      const waiterBalanceAfter = await tronWrap.trx.getBalance(waiter);
      expect(waiterBalanceAfter).to.be.equal(waiterBalanceBefore + 50);
    });
  })
});
