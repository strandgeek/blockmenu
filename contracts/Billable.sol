// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./MenuManageable.sol";

abstract contract Billable is MenuManageable {
  enum BillStatus {
    UNPAID,
    PAID,
    CANCELLED
  }

  struct OrderLine {
    uint menuItemIdx;
    uint quantity;
  }

  struct Order {
    uint id;
    uint billId;
    bool exists;
  }

  struct Bill {
    uint id;
    address owner;
    address waiter;
    uint menuVersion;
    string metadataCID;
    BillStatus status;
    uint ordersTotal;
    uint createdAt;
    bool exists;
  }

  struct OrderInfo {
    uint id;
    Bill bill;
    OrderLine[] lines;
  }

  uint lastBillId = 0;
  uint lastOrderId = 0;
  // Bill ID -> Bill
  mapping(uint => Bill) private _bills;
  // Account -> Current Bill ID
  mapping(address => uint) private _currentAccountBills;
  // Order ID -> Order
  mapping(uint => Order) _orders;
  // BillID -> Order Index ->  Order;
  mapping(uint => mapping(uint => Order)) _billOrders;
  // OrderID -> OrderLines;
  mapping(uint => OrderLine[]) _orderLines;


  function _getAccountCurrentBill(address account) internal view returns (Bill storage) {
    uint currentBillId = _currentAccountBills[account];
    Bill storage currentBill = _bills[currentBillId];
    return currentBill;
  }

  function _createBill(string memory metadataCID) internal returns (uint) {
    if (menuVersion == 0) {
      revert('menu is not ready');
    }
    Bill storage currentBill = _getAccountCurrentBill(msg.sender);
    if (currentBill.exists && currentBill.status == BillStatus.UNPAID) {
      revert('current bill is still active');
    }
    uint id = lastBillId + 1;
    _bills[id] = Bill({
      id: id,
      owner: msg.sender,
      waiter: address(0), // Initially the waiter is not assigned
      menuVersion: menuVersion,
      metadataCID: metadataCID,
      status: BillStatus.UNPAID,
      ordersTotal: 0,
      createdAt: block.timestamp,
      exists: true
    });
    _currentAccountBills[msg.sender] = id;
    lastBillId = id;
    return id;
  }

  function _checkBillExists(uint billId) internal view {
    require(_bills[billId].exists, 'bill does not exist');
  }

  function _createOrder(OrderLine[] memory orderLines) internal returns (uint) {
    uint id = lastOrderId + 1;
    uint currentBillId = _currentAccountBills[msg.sender];
    Bill storage currentBill = _getAccountCurrentBill(msg.sender);
    if (!currentBill.exists || currentBill.status != BillStatus.UNPAID) {
      revert('no active bill');
    }
    uint orderIdx = currentBill.ordersTotal;
    _billOrders[currentBillId][orderIdx] = Order({
      id: id,
      billId: currentBillId,
      exists: true
    });

    for (uint i; i<orderLines.length; i++) {
      _checkMenuItemIdx(orderLines[i].menuItemIdx);
      _orderLines[id].push(OrderLine({ menuItemIdx: orderLines[i].menuItemIdx, quantity: orderLines[i].quantity }));
    }

    _orders[id] = _billOrders[currentBillId][orderIdx];

    currentBill.ordersTotal++;

    lastOrderId = id;
    return id;
  }

  function _getOrderInfo(uint orderId) internal view returns (OrderInfo memory) {
    Order storage order = _orders[orderId];
    OrderInfo memory orderInfo = OrderInfo({
      id: orderId,
      bill: _bills[order.billId],
      lines: _orderLines[order.id]
    });
    return orderInfo;
  }

  function _getLatestOrderInfos() internal view returns (OrderInfo[] memory) {
    // TODO: Implement pagination system here
    OrderInfo[] memory orderInfos = new OrderInfo[](lastOrderId);
    for (uint i=lastOrderId; i >= 1; i--) {
      orderInfos[i-1] = _getOrderInfo(i);
    }
    return orderInfos;
  }

  function _getBillOrdersInfo(uint billId) internal view returns (OrderInfo[] memory) {
    _checkBillExists(billId);
    Bill storage bill = _bills[billId];
    OrderInfo[] memory orderInfos = new OrderInfo[](bill.ordersTotal);
    for (uint i=0; i<bill.ordersTotal; i++) {
      orderInfos[i] = _getOrderInfo(_billOrders[bill.id][i].id);
    }
    return orderInfos;
  }

  function _assignWaiterToBill(uint billId, address waiter) internal {
    _checkBillExists(billId);
    Bill storage bill = _bills[billId];
    bill.waiter = waiter;
  }

  function _getBillTotalAmount(uint billId) internal view returns (uint) {
    _checkBillExists(billId);
    OrderInfo[] memory orderInfos = _getBillOrdersInfo(billId);
    uint total = 0;
    for (uint i=0; i<orderInfos.length; i++) {
      for (uint j=0; j<orderInfos[i].lines.length; j++) {
        OrderLine memory line = orderInfos[i].lines[j];
        uint amount = _menuItems[menuVersion][line.menuItemIdx].amount;
        total += amount * line.quantity;
      }
    }
    return total;
  }

  function _payBill(uint billId) internal {
    _checkBillExists(billId);
    Bill storage bill = _bills[billId];
    uint totalAmount = _getBillTotalAmount(billId);
    require(msg.value >= totalAmount, 'insufficient value');
    if (bill.waiter != address(0) && msg.value > totalAmount) {
      // The tip is all the amount that exceeds the bill amount
      uint tip = msg.value - totalAmount;
      address payable waiterAcccount = payable(bill.waiter);
      waiterAcccount.transfer(tip);
    }
    bill.status = BillStatus.PAID;
  }
}
