// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RestaurantStaff.sol";

contract TapMenu is Ownable, RestaurantStaff {
  enum BillStatus {
    UNPAID,
    PAID,
    CANCELLED
  }

  struct Bill {
    address owner;
    BillStatus status;
    int createdAt;
    string metadataCID;
    address waiter;
  }

  struct RoleAssignment {
    address addr;
    uint role;
  }

  constructor() {}

  /**
   * @dev Add a member to the Restaurant Staff (Only Contract Owner is allowed)
   */
  function addMember(address account, uint role) public onlyOwner {
    _addMember(account, role);
  }

  /**
   * @dev Remove a member from the Restaurant Staff (Only Contract Owner is allowed)
   */
  function removeMember(address account) public onlyOwner {
    _removeMember(account);
  }

  /**
   * @dev Returns all members and roles from the Restaurant Staff
   */
  function getMembers() public view returns (MemberInfo[] memory) {
    return _getMembers();
  }
}
