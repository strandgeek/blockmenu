const {
  expectTxnSuccess,
  expectTxnRevertWith
} = require('./helpers/txn');

const TapMenu = artifacts.require('TapMenu');

contract('TapMenu > MenuManageable', accounts => {
  let tapMenu;

  before(async function () {
    tapMenu = await TapMenu.deployed();
  });

  const owner = accounts[0];

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await tapMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  describe('createMenu', () => {
    const params = [
      'MY_METADATA_CID',
      [
        [1099],
        [1155],
      ]
    ];
    it('as owner: the menu should be created successfully', async () => {
      await expectTxnSuccess(tapMenu.createMenu(params, { from: owner }));
      const menuRes = await tapMenu.getMenu();
      const menu = menuRes.valueOf();
      expect(menu[0].metadataCID).to.be.equal('MY_METADATA_CID');
      expect(menu[0].itemsTotal.toNumber()).to.be.equal(2);
      expect(menu[1][0].amount.toNumber()).to.be.equal(1099);
      expect(menu[1][1].amount.toNumber()).to.be.equal(1155);
    });
    it('as admin: the menu should be created successfully', async () => {
      await tapMenu.addMember(accounts[4], 0x01, { from: owner });
      await expectTxnSuccess(tapMenu.createMenu(params, { from: accounts[4] }));
    });
    it('as waiter: a forbidden error should be thrown', async () => {
      await tapMenu.addMember(accounts[5], 0x02, { from: owner });
      await expectTxnRevertWith(
        tapMenu.createMenu(params, { from: accounts[5] }),
        'forbidden',
      );
    });
    it('as non-member: a forbidden error should be thrown', async () => {
      await expectTxnRevertWith(
        tapMenu.createMenu(params, { from: accounts[3] }),
        'forbidden',
      );
    });
  });
});
