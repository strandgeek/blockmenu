const { expectTxnSuccess, expectTxnRevertWith } = require("./helpers/txn");

const TapMenu = artifacts.require("TapMenu");

contract("TapMenu > Billable", (accounts) => {
  let tapMenu;

  before(async function () {
    tapMenu = await TapMenu.deployed();
  });

  const owner = accounts[0];

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await tapMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  describe("createBill", () => {
    it("should not create the bill when the menu is not ready", async () => {
      await expectTxnRevertWith(
        tapMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] }),
        "menu is not ready"
      );
    });
    it("should create the bill properly", async () => {
      const menuParams = ["MY_METADATA_CID", [[100], [200]]];
      await expectTxnSuccess(tapMenu.createMenu(menuParams, { from: owner }));

      // Should create successfully the first bill
      await expectTxnSuccess(
        tapMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] })
      );

      // Should thrown error for second bill since the first bill is still active
      await expectTxnRevertWith(
        tapMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[4] }),
        "current bill is still active"
      );
    });
  });

  describe("createOrder", () => {
    it("should throw error if an menuItemIdx does not exist on menu", async () => {
      await expectTxnSuccess(
        tapMenu.createBill("MY_BILL_METADATA_CID", { from: accounts[5] })
      );
      await expectTxnRevertWith(
        tapMenu.createOrder(
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
        tapMenu.createOrder(
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
      const orderInfos = await tapMenu.getLatestOrderInfos({
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

      const billAmountRes = await tapMenu.getBillTotalAmount(orderInfo.bill.id.toNumber());
      expect(billAmountRes.valueOf().toNumber()).to.be.equal(800);
    });
  });
});
