import { time, loadFixture, } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BlockMenu } from "../typechain-types";
import { Signer } from "ethers";

describe("BlockMenu", function () {

  async function deployEmptyContract() {
    const accounts = await ethers.getSigners();

    const BlockMenu = await ethers.getContractFactory("BlockMenu");
    const blockMenu = await BlockMenu.deploy('MENU_IPFS_CID', [{ amount: 100 }, { amount: 200 }], { value: 100 });

    const [owner, admin, waiter, customer, customerWithoutBill] = accounts;

    // Adding roles to restaurant staff members
    await blockMenu.addMember(admin.address, 0x01);
    await blockMenu.addMember(waiter.address, 0x02);

    return { blockMenu, accounts, owner, admin, waiter, customer, customerWithoutBill };
  }

  async function deployContractWithABill() {
    const vars = await deployEmptyContract();

    const { blockMenu, customer } = vars;

    // Creating a bill for the customer
    await blockMenu.connect(customer).createBill('BILL_1_CID');

    return { ...vars };
  }

  describe("Deployment", function () {
    it("Should set the right initial menu", async function () {
      const { blockMenu } = await loadFixture(deployEmptyContract);
      const [menu, items] = await blockMenu.getMenu();
      expect(menu.metadataCID).to.be.equal('MENU_IPFS_CID');
      expect(menu.exists).to.be.equal(true);
      expect(items).to.lengthOf(2);
      expect(items[0].amount).to.be.equal(100);
      expect(items[1].amount).to.be.equal(200);
    });
  });

  describe("Withdraw", async function () {
    describe('As owner', () => {
      it('The withdraw should be successfully done', async function() {
        const { blockMenu, accounts } = await loadFixture(deployEmptyContract);
        const toAccount = accounts[5];
        const txn = blockMenu.withdraw(toAccount.address, 50);
        await expect(txn).not.to.reverted;
        await expect(txn).to.changeEtherBalances(
          [blockMenu, toAccount],
          [-50, 50],
        );
      });
      it('The withdraw should be fail when toAccount is a zero address', async function() {
        const { blockMenu, accounts } = await loadFixture(deployEmptyContract);
        const toAccount = accounts[5];
        const txn = blockMenu.withdraw('0x0000000000000000000000000000000000000000', 50);
        await expect(txn).to.revertedWith('could not withdraw to zero address');
      });
      it('The withdraw should be fail when value is zero', async function() {
        const { blockMenu, accounts } = await loadFixture(deployEmptyContract);
        const toAccount = accounts[5];
        const txn = blockMenu.withdraw(toAccount.address, 0);
        await expect(txn).to.revertedWith('value is zero');
      });
      it('The withdraw should be fail when request amount is greater than contract balance', async function() {
        const { blockMenu, accounts } = await loadFixture(deployEmptyContract);
        const toAccount = accounts[5];
        const txn = blockMenu.withdraw(toAccount.address, 150);
        await expect(txn).to.revertedWith('insufficient funds');
      });
    })
    it('As admin: the admin should NOT be allowed to withdraw', async function() {
      const { blockMenu, accounts } = await loadFixture(deployEmptyContract);
      const toAccount = accounts[5];
      await expect(blockMenu.withdraw(toAccount.address, 50)).not.to.reverted;
    });
  });

  describe("Create Menu", async function () {
    const expectCreateMenu = async (blockMenu: BlockMenu, from: Signer, shouldRevert: boolean) => {
      const txn = blockMenu.connect(from).createMenu('NEW_MENU_CID', [{ amount: 100 }, { amount: 200 }, { amount: 300 }]);
      if (shouldRevert) {
        await expect(txn).to.be.revertedWith('forbidden');
      } else {
        await expect(txn).not.to.be.reverted;
      }
    }
    it("As owner: The menu should be created successfully", async function () {
      const { blockMenu, owner } = await loadFixture(deployEmptyContract);
      await expectCreateMenu(blockMenu, owner, false);
    });
    it("As admin: The menu should be created successfully", async function () {
      const { blockMenu, admin } = await loadFixture(deployEmptyContract);
      await expectCreateMenu(blockMenu, admin, false);
    });
    it("As waiter: User should not be allowed to create menu", async function () {
      const { blockMenu, waiter } = await loadFixture(deployEmptyContract);
      await expectCreateMenu(blockMenu, waiter, true);
    });
    it("As customer: User should not be allowed to create menu", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      await expectCreateMenu(blockMenu, customer, true);
    });
  });


  describe("Create Bill", async function () {
    it("The customer should be able to create a bill", async function () {
      const { blockMenu, customerWithoutBill } = await loadFixture(deployEmptyContract);
      await expect(blockMenu.connect(customerWithoutBill).createBill('BILL_1_CID')).not.to.be.reverted;
    });
    it("The customer should NOT create a bill if there is already an active bill", async function () {
      const { blockMenu, customerWithoutBill } = await loadFixture(deployEmptyContract);
      await expect(blockMenu.connect(customerWithoutBill).createBill('BILL_1_CID')).not.to.be.reverted;
      await expect(blockMenu.connect(customerWithoutBill).createBill('BILL_2_CID')).to.be.revertedWith('current bill is still active');
    });
  });

  describe("Assign Waiter to Bill", async function () {
    const expectAssignWaiter = async (blockMenu: BlockMenu, from: Signer, waiter: Signer & { address: string }, shouldRevert: boolean) => {
      const txn = blockMenu.connect(from).assignWaiterToBill(1, waiter.address);
      if (shouldRevert) {
        await expect(txn).to.be.revertedWith('forbidden');
      } else {
        await expect(txn).not.to.be.reverted;
      }
    }
    it("As owner: The waiter should be assigned successfully", async function () {
      const { blockMenu, owner, waiter } = await loadFixture(deployContractWithABill);
      await expectAssignWaiter(blockMenu, owner, waiter, false);
    });
    it("As admin: The waiter should be assigned successfully", async function () {
      const { blockMenu, admin, waiter } = await loadFixture(deployContractWithABill);
      await expectAssignWaiter(blockMenu, admin, waiter, false);
    });
    it("As waiter: The waiter should be assigned successfully", async function () {
      const { blockMenu, waiter } = await loadFixture(deployContractWithABill);
      await expectAssignWaiter(blockMenu, waiter, waiter, false);
    });
    it("As customer: The customer should not have permission to assign a waiter to a bill", async function () {
      const { blockMenu, customer, waiter } = await loadFixture(deployContractWithABill);
      await expectAssignWaiter(blockMenu, customer, waiter, true);
    });
  });

  describe("Create Order", async function () {
    it("Customer should be able to create order for the current bill", async function () {
      const { blockMenu, customer } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.connect(customer).createOrder([{ menuItemIdx: 0, quantity: 3 }])).not.to.reverted;
    });
    it("Customer should NOT be able to create order if there is no active bill", async function () {
      const { blockMenu, customerWithoutBill } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.connect(customerWithoutBill).createOrder([{ menuItemIdx: 0, quantity: 3 }])).to.revertedWith('no active bill');
    });
  });

  describe("Bill Total Amount", async function () {
    it("The bill total amount should be calculated based on the menu version and keep the same even if the menu price changes", async function () {
      const { blockMenu, customer } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.connect(customer).createOrder([{ menuItemIdx: 0, quantity: 1 }])).not.to.reverted;
      const billTotalBefore = await blockMenu.getBillTotalAmount(1);
      expect(billTotalBefore).to.be.equal(100);
      // Change the menu prices
      await blockMenu.createMenu('NEW_MENU_CID', [{ amount: 800 }, { amount: 900 }]);
      const billTotalAfter = await blockMenu.getBillTotalAmount(1);
      expect(billTotalAfter).to.be.equal(100);
      await expect(blockMenu.payBill(1, { value: 100 })).not.to.reverted;
      // Create another bill (Now the prices would be updated)
      await expect(blockMenu.connect(customer).createBill('ANOTHER_BILD_CID')).not.to.reverted;
      await expect(blockMenu.connect(customer).createOrder([{ menuItemIdx: 0, quantity: 1 }])).not.to.reverted;
      expect(await blockMenu.getBillTotalAmount(2)).to.be.equal(800);
    });
  });

  describe("Pay Bill", async function () {
    it("The bill should be paid when the user sends the exact value", async function () {
      const { blockMenu, customer } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.connect(customer).createOrder([
        { menuItemIdx: 0, quantity: 3 },
        { menuItemIdx: 1, quantity: 2 }
      ])).not.to.reverted;
      const billTotal = await blockMenu.getBillTotalAmount(1);
      expect(billTotal).to.be.equal(700);
      const txn = blockMenu.connect(customer).payBill(1, { value: billTotal });
      await expect(txn).not.to.reverted;
      await expect(txn).to.changeEtherBalances(
        [customer, blockMenu],
        [-700, 700],
      );
    });
    it("The bill should NOT be paid when the user sends an insufficient value", async function () {
      const { blockMenu, customer } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.connect(customer).createOrder([
        { menuItemIdx: 0, quantity: 3 },
        { menuItemIdx: 1, quantity: 2 }
      ])).not.to.reverted;
      const billTotal = await blockMenu.getBillTotalAmount(1);
      expect(billTotal).to.be.equal(700);
      await expect(blockMenu.connect(customer).payBill(1, { value: 500 })).to.revertedWith('insufficient value');
    });
    it("The bill should be paid and tips should be transferred to waiter (if waiter is assigned)", async function () {
      const { blockMenu, customer, waiter } = await loadFixture(deployContractWithABill);
      await expect(blockMenu.assignWaiterToBill(1, waiter.address)).not.to.reverted;
      await expect(blockMenu.connect(customer).createOrder([
        { menuItemIdx: 0, quantity: 3 },
        { menuItemIdx: 1, quantity: 2 }
      ])).not.to.reverted;
      const billTotal = await blockMenu.getBillTotalAmount(1);
      expect(billTotal).to.be.equal(700);
      const txn = blockMenu.connect(customer).payBill(1, { value: 750 });
      await expect(txn).not.to.reverted;
      await expect(txn).to.changeEtherBalances(
        [customer, blockMenu, waiter],
        [-750, 700, 50],
      );
    });
  });

  describe("Search Orders", async function () {
    const createManyOrders = async (blockMenu: BlockMenu, customer: Signer) => {
      await blockMenu.connect(customer).createBill('BILL_TEST_CID');
      const firstBlockTime = await time.latest();
      for (let i = 0; i < 12; i++) {
        await blockMenu.connect(customer).createOrder([{ menuItemIdx: 0, quantity: 1 }]);
        const nextTime = (await time.latest()) + 3600; // Jump 1 day
        await time.increaseTo(nextTime);
      }
      const lastBlockTime = await time.latest();
      return {
        firstBlockTime,
        lastBlockTime,
      }
    };
    it("Get Orders (Without Filters)", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      await createManyOrders(blockMenu, customer);
      const orders = await blockMenu.getOrdersInfo({
        fromDate: 0,
        toDate: 0,
      });
      expect(orders).to.have.lengthOf(12);
    });
    it("Get Orders filtered by start date", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { firstBlockTime } = await createManyOrders(blockMenu, customer);
      expect(await blockMenu.getOrdersInfo({
        fromDate: firstBlockTime,
        toDate: 0,
      })).to.have.lengthOf(12);
      expect(await blockMenu.getOrdersInfo({
        fromDate: firstBlockTime + 3600,
        toDate: 0,
      })).to.have.lengthOf(11);
      expect(await blockMenu.getOrdersInfo({
        fromDate: firstBlockTime + 7200,
        toDate: 0,
      })).to.have.lengthOf(10);
    });
    it("Get Orders filtered by end date", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { lastBlockTime } = await createManyOrders(blockMenu, customer);
      expect(await blockMenu.getOrdersInfo({
        fromDate: 0,
        toDate: lastBlockTime,
      })).to.have.lengthOf(12);
      expect(await blockMenu.getOrdersInfo({
        fromDate: 0,
        toDate: lastBlockTime - 7200,
      })).to.have.lengthOf(11);
      expect(await blockMenu.getOrdersInfo({
        fromDate: 0,
        toDate: lastBlockTime - 10800,
      })).to.have.lengthOf(10);
    });
    it("Get Orders filtered by between dates", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { firstBlockTime, lastBlockTime } = await createManyOrders(blockMenu, customer);
      const result = await blockMenu.getOrdersInfo({
        fromDate: firstBlockTime + 7200,
        toDate: lastBlockTime - 10800,
      });
      expect(result).to.have.lengthOf(8);
      expect(result[0].id).to.be.equal(3);
      expect(result[result.length - 1].id).to.be.equal(10);
    });
  });

  describe("Search Bills", async function () {
    const createManyBills = async (blockMenu: BlockMenu, customer: Signer & { address: string }) => {
      const firstBlockTime = await time.latest();
      for (let i = 0; i < 12; i++) {
        await blockMenu.connect(customer).createBill(`BILL_TEST_CID_${i}`);
        await blockMenu.connect(customer).createOrder([{ menuItemIdx: 0, quantity: 1 }]);
        const bill = await blockMenu.getAccountCurrentBill(customer.address);
        await blockMenu.connect(customer).payBill(bill.id, { value: 100 });
        const nextTime = (await time.latest()) + 3600; // Jump 1 day
        await time.increaseTo(nextTime);
      }
      const lastBlockTime = await time.latest();
      return {
        firstBlockTime,
        lastBlockTime,
      }
    };
    it("Get Orders (Without Filters)", async function () {
      const { blockMenu, customerWithoutBill } = await loadFixture(deployEmptyContract);
      await createManyBills(blockMenu, customerWithoutBill);
      const bills = await blockMenu.getBillsInfo({
        fromDate: 0,
        toDate: 0,
      });
      expect(bills).to.have.lengthOf(12);
    });
    it("Get Bills filtered by start date", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { firstBlockTime } = await createManyBills(blockMenu, customer);
      expect(await blockMenu.getBillsInfo({
        fromDate: firstBlockTime,
        toDate: 0,
      })).to.have.lengthOf(12);
      expect(await blockMenu.getBillsInfo({
        fromDate: firstBlockTime + 3600,
        toDate: 0,
      })).to.have.lengthOf(11);
      expect(await blockMenu.getBillsInfo({
        fromDate: firstBlockTime + 7200,
        toDate: 0,
      })).to.have.lengthOf(10);
    });
    it("Get Bills filtered by end date", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { lastBlockTime } = await createManyBills(blockMenu, customer);
      expect(await blockMenu.getBillsInfo({
        fromDate: 0,
        toDate: lastBlockTime,
      })).to.have.lengthOf(12);
      expect(await blockMenu.getBillsInfo({
        fromDate: 0,
        toDate: lastBlockTime - 7200,
      })).to.have.lengthOf(11);
      expect(await blockMenu.getBillsInfo({
        fromDate: 0,
        toDate: lastBlockTime - 10800,
      })).to.have.lengthOf(10);
    });
    it("Get Bills filtered by between dates", async function () {
      const { blockMenu, customer } = await loadFixture(deployEmptyContract);
      const { firstBlockTime, lastBlockTime } = await createManyBills(blockMenu, customer);
      const result = await blockMenu.getBillsInfo({
        fromDate: firstBlockTime + 7200,
        toDate: lastBlockTime - 10800,
      });
      expect(result).to.have.lengthOf(8);
      expect(result[0].id).to.be.equal(3);
      expect(result[result.length - 1].id).to.be.equal(10);
    });
  });
});
