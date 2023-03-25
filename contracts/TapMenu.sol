// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Billable.sol";
import "./MenuManageable.sol";
import "./RestaurantStaff.sol";

contract TapMenu is Ownable, MenuManageable, Billable, RestaurantStaff {
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
   * @dev Create a Menu (Only Admins and Contract Owners are allowed)
   * Returns: The created Menu ID
   */
  function createMenu(string memory metadataCID, MenuItem[] memory items) public onlyAdmin returns (uint) {
    return _createMenu(metadataCID, items);
  }

  /**
   * @dev Create a Menu (Only Admins and Contract Owners are allowed)
   * Returns: The created Menu ID
   */
  function createBill(string memory metadataCID) public returns (uint) {
    return _createBill(metadataCID);
  }

  // Getters

  /**
   * @dev Returns all members and roles from the Restaurant Staff
   */
  function getMembers() public view returns (MemberInfo[] memory) {
    return _getMembers();
  }

  /**
   * @dev Returns the menu data
   */
  function getMenu() public view returns (Menu memory, MenuItem[] memory) {
    return _getMenu();
  }
}
