const {
  expectTxnSuccess,
  expectTxnRevertWith
} = require('./helpers/txn');

const BlockMenu = artifacts.require('BlockMenu');

contract('BlockMenu > RestaurantStaff', accounts => {
  let blockMenu;

  before(async function () {
    blockMenu = await BlockMenu.deployed();
  });

  const owner = accounts[0];

  it("should verify that the contract has been deployed by accounts[0]", async function () {
    assert.equal(await blockMenu.owner(), tronWeb.address.toHex(accounts[0]));
  });

  it('the contract owner should be able to add staff members', async function () {
    const membersBefore = await blockMenu.getMembers({ from: owner });
    expect(membersBefore.valueOf()).to.have.length(0);

    await expectTxnSuccess(blockMenu.addMember(accounts[1], 0x01, { from: owner }));

    // The owner should not be able to add an user that is already a member
    await expectTxnRevertWith(
      blockMenu.addMember(accounts[1], 0x01, { from: owner }),
      'is already a member',
    );

    const membersAfter = await blockMenu.getMembers({ from: owner });
    const members = membersAfter.valueOf();
    expect(members).to.have.length(1);
    const [memberInfo] = members;
    expect(memberInfo.account).to.be.equal(tronWeb.address.toHex(accounts[1]));
    expect(memberInfo.role.toNumber()).to.be.equal(0x01);

    await blockMenu.removeMember(accounts[1], { from: owner });

    // Removing member from Restaurant Staff
    const membersAfterRemove = await blockMenu.getMembers({ from: owner });
    expect(membersAfterRemove.valueOf()).to.have.length(0);

    // The owner cannot remove a user that is not a member
    await expectTxnRevertWith(
      blockMenu.removeMember(accounts[5], { from: owner }),
      'is not a member',
    );
  });

  it('an owner should not be able to addMember with an invalid role', async function () {
    await expectTxnRevertWith(
      blockMenu.addMember(accounts[1], 0x99, { from: owner }),
      'invalid role code',
    );
  });

  it('a non-owner account should not be forbidden to add/remove member', async function () {
    const membersBefore = await blockMenu.getMembers({ from: owner });
    expect(membersBefore.valueOf()).to.have.length(0);

     // Adding member to Restaurant Staff as a non-owner
    await expectTxnRevertWith(
      blockMenu.addMember(accounts[2], 0x01, { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );

    // Add a user as owner to delete next
    await blockMenu.addMember(accounts[1], 0x01, { from: owner });

    // Removing member from Restaurant Staff as a non-owner
    await expectTxnRevertWith(
      blockMenu.removeMember(accounts[1], { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );
  });
});
