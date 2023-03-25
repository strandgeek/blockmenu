// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract RestaurantStaff is Ownable {

  // Roles
  uint public constant ADMIN_ROLE  = 0x01;
  uint public constant WAITER_ROLE = 0x02;

  // Member Address -> Role
  mapping(address => uint) private _membersRoles;
  address[] private _members;

  struct MemberInfo {
    address account;
    uint role;
  }

  /**
    * @dev Returns `true` if `account` is a member.
    */
  function _isMember(address account) private view returns (bool) {
    return _membersRoles[account] != 0;
  }

  /**
    * @dev Returns `true` if `account` has been granted `role`.
    */
  function hasRole(address account, uint role) public view virtual returns (bool) {
    return _membersRoles[account] == role;
  }

  /**
   * @dev Add a member to the restaurant staff
   */
  function _addMember(address account, uint role) internal virtual {
    require(!_isMember(account), "is already a member");
    require(role == ADMIN_ROLE || role == WAITER_ROLE, "invalid role code");
    _members.push(account);
    _membersRoles[account] = role;
  }

  /**
   * @dev Remove a member from the restaurant staff
   */
  function _removeMember(address account) internal virtual {
    require(_isMember(account), "is not a member");
    delete _membersRoles[account];
    address[] memory newMembers = new address[](_members.length - 1);
    uint idx = 0;
    for (uint i; i<_members.length; i++) {
      if (_members[i] != account) {
        newMembers[idx] = account;
        idx++;
      }
    }
    _members = newMembers;
  }

  /**
    * @dev Throws if the sender is not the owner or is not in the roles list provided
    */
  function _checkRoles(uint[] memory roles) internal view virtual {
    if (msg.sender == owner()) {
      // The contract owner has all permissions
      return;
    }

    for (uint i; i < roles.length; i++) {
      if (hasRole(msg.sender, roles[i])) {
        return;
      }
    }

    revert("forbidden");
  }

  /**
  * @dev Throws if called by any account other than an admin or the owner
  */
  modifier onlyAdmin() {
    uint[] memory roles = new uint[](1);
    roles[0] = ADMIN_ROLE;
    _checkRoles(roles);
    _;
  }

  /**
  * @dev Throws if called by any account other than an staff member or the owner
  */
  modifier onlyStaff() {
    uint[] memory roles = new uint[](2);
    roles[0] = ADMIN_ROLE;
    roles[1] = WAITER_ROLE;
    _checkRoles(roles);
    _;
  }


  function _getMembers() internal view returns (MemberInfo[] memory) {
    MemberInfo[] memory memberInfos = new MemberInfo[](_members.length);
    for (uint i; i<_members.length; i++) {
      address account = _members[i];
      uint role = _membersRoles[account];
      memberInfos[i] = MemberInfo(account, role);
    }
    return memberInfos;
  }
}
