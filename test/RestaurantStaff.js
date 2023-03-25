const {
  expectTxnSuccess,
  expectTxnRevertWith
} = require('./helpers/txn');

const TapMenu = artifacts.require('TapMenu');

contract('TapMenu > RestaurantStaff', accounts => {
  let tapMenu;

  before(async function () {
    tapMenu = await TapMenu.deployed();
  });

  const owner = accounts[0];

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await tapMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  it('the contract owner should be able to add staff members', async function () {
    const membersBefore = await tapMenu.getMembers({ from: owner });
    expect(membersBefore.valueOf()).to.have.length(0);

    await expectTxnSuccess(tapMenu.addMember(accounts[1], 0x01, { from: owner }));

    // The owner should not be able to add an user that is already a member
    await expectTxnRevertWith(
      tapMenu.addMember(accounts[1], 0x01, { from: owner }),
      'is already a member',
    );

    const membersAfter = await tapMenu.getMembers({ from: owner });
    expect(membersAfter.valueOf()).to.have.length(1);

    await tapMenu.removeMember(accounts[1], { from: owner });

    // Removing member from Restaurant Staff
    const membersAfterRemove = await tapMenu.getMembers({ from: owner });
    expect(membersAfterRemove.valueOf()).to.have.length(0);

    // The owner cannot remove a user that is not a member
    await expectTxnRevertWith(
      tapMenu.removeMember(accounts[5], { from: owner }),
      'is not a member',
    );
  });

  it('an owner should not be able to addMember with an invalid role', async function () {
    await expectTxnRevertWith(
      tapMenu.addMember(accounts[1], 0x99, { from: owner }),
      'invalid role code',
    );
  });

  it('a non-owner account should not be forbidden to add/remove member', async function () {
    const membersBefore = await tapMenu.getMembers({ from: owner });
    expect(membersBefore.valueOf()).to.have.length(0);

     // Adding member to Restaurant Staff as a non-owner
    await expectTxnRevertWith(
      tapMenu.addMember(accounts[2], 0x01, { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );

    // Add a user as owner to delete next
    await tapMenu.addMember(accounts[1], 0x01, { from: owner });

    // Removing member from Restaurant Staff as a non-owner
    await expectTxnRevertWith(
      tapMenu.removeMember(accounts[1], { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );
  });
});
