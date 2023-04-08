// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Billable.sol";
import "./MenuManageable.sol";
import "./RestaurantStaff.sol";

contract BlockMenu is Ownable, MenuManageable, Billable, RestaurantStaff {
  constructor(string memory metadataCID, MenuItem[] memory items) payable {
    if (bytes(metadataCID).length > 0 && items.length > 0) {
      _createMenu(metadataCID, items);
    }
  }

  /**
   * @dev Withdraw the contract balance (Only Contract Owner is allowed)
   */
  function withdraw(address payable toAccount, uint value) public payable onlyOwner {
    require(toAccount != address(0), 'could not withdraw to zero address');
    require(value > 0, 'value is zero');
    require(address(this).balance >= value, 'insufficient funds');
    toAccount.transfer(value);
  }

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
   * @dev Create a Bill
   * Returns: The created Bill ID
   */
  function createBill(string memory metadataCID) public returns (uint) {
    return _createBill(metadataCID);
  }


  /**
   * @dev Assign a Waiter to a Bill (Only the staff is allowed)
   */
  function assignWaiterToBill(uint billId, address waiter) public onlyStaff {
    require(hasRole(waiter, WAITER_ROLE), 'provided account is not a waiter');
    return _assignWaiterToBill(billId, waiter);
  }

  /**
   * @dev Pay a bill. All amount that exceeds the bill total will be transfered to the waiter (if assigned)
   */
  function payBill(uint billId) public payable {
    return _payBill(billId);
  }

  /**
   * @dev Create a Order for the current bill
   * Returns: The created Order ID
   */
  function createOrder(OrderLine[] memory orderLines) public returns (uint) {
    return _createOrder(orderLines);
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

  /**
   * @dev Returns the orders info list
   */
  function getOrdersInfo(OrderInfoFilter memory filter) public view returns (OrderInfo[] memory) {
    return _getOrdersInfo(filter);
  }

  /**
   * @dev Returns the orders info list
   */
  function getBillsInfo(BillInfoFilter memory filter) public view returns (BillInfo[] memory) {
    return _getBillsInfo(filter);
  }

  /**
   * @dev Returns account current bill
   */
  function getAccountCurrentBill(address account) public view returns (Bill memory) {
    return _getAccountCurrentBill(account);
  }

  /**
   * @dev Returns the bill total amount of a bill
   */
  function getBillTotalAmount(uint billId) public view returns (uint) {
    return _getBillTotalAmount(billId);
  }

  /**
   * @dev Returns the bill orders info
   */
  function getBillOrdersInfo(uint billId) public view returns (OrderInfo[] memory) {
    return _getBillOrdersInfo(billId);
  }

  /**
   * @dev Returns the order info by id
   */
  function getOrderInfo(uint orderId) public view returns (OrderInfo memory) {
    return _getOrderInfo(orderId);
  }
}
