const {
  expectTxnSuccess,
  expectTxnRevertWith
} = require('./helpers/txn');

const TapMenu = artifacts.require('TapMenu');

contract('TapMenu > Billable', accounts => {
  let tapMenu;

  before(async function () {
    tapMenu = await TapMenu.deployed();
  });

  const owner = accounts[0];

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await tapMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  describe('createBill', () => {
    it('should create the bill properly', async () => {
      // Should create successfully the first bill
      await expectTxnSuccess(tapMenu.createBill('MY_BILL_METADATA_CID', { from: accounts[4] }));

      // Should thrown error for second bill since the first bill is still active
      await expectTxnRevertWith(
        tapMenu.createBill('MY_BILL_METADATA_CID', { from: accounts[4] }),
        'current bill is still active',
      );
    });
  });
});
