// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";


abstract contract Billable {
  enum BillStatus {
    UNPAID,
    PAID,
    CANCELLED
  }

  struct Bill {
    address owner;
    string metadataCID;
    BillStatus status;
    uint ordersTotal;
    uint createdAt;
    bool exists;
  }

  uint lastBillId = 0;
  // Bill ID -> Bill
  mapping(uint => Bill) private _bills;
  // Account -> Current Bill ID
  mapping(address => uint) private _currentAccountBills;


  function _getAccountCurrentBill(address account) internal view returns (Bill storage) {
    uint currentBillId = _currentAccountBills[account];
    Bill storage currentBill = _bills[currentBillId];
    return currentBill;
  }

  function _createBill(string memory metadataCID) internal returns (uint) {
    Bill storage currentBill = _getAccountCurrentBill(msg.sender);
    if (currentBill.exists && currentBill.status == BillStatus.UNPAID) {
      revert('current bill is still active');
    }
    uint id = lastBillId + 1;
    _bills[id] = Bill(
      msg.sender,
      metadataCID,
      BillStatus.UNPAID,
      0,
      block.timestamp,
      true
    );
    _currentAccountBills[msg.sender] = id;
    return id;
  }
}
