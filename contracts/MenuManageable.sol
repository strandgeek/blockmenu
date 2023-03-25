// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";


abstract contract MenuManageable {
  uint menuVersion = 0;
  uint activeMenuVersion = 0;

  struct MenuItem {
    uint amount;
  }

  struct Menu {
    string metadataCID;
    uint itemsTotal;
    bool exists;
  }

  // Menu Version -> Menu
  mapping(uint => Menu) private _menus;

  // Menu Version -> Item ID -> Menu Item
  mapping(uint => mapping(uint => MenuItem)) _menuItems;


  function _createMenu(string memory metadataCID, MenuItem[] memory items) internal returns (uint newMenuVersion) {
    uint version = menuVersion + 1;
    _menus[version] = Menu(
      metadataCID,
      items.length,
      true
    );
    for (uint itemIdx=0; itemIdx<items.length; itemIdx++) {
      _menuItems[version][itemIdx] = MenuItem(items[itemIdx].amount);
    }
    newMenuVersion = version;
    menuVersion = version;
  }

  function _getMenu() internal view returns (Menu memory, MenuItem[] memory) {
    if (menuVersion == 0) {
      revert('no menu created yet');
    }
    Menu memory menu = Menu(
      _menus[menuVersion].metadataCID,
      _menus[menuVersion].itemsTotal,
      _menus[menuVersion].exists
    );

    MenuItem[] memory items = new MenuItem[](menu.itemsTotal);

    for (uint i=0; i<menu.itemsTotal; i++) {
      items[i] = MenuItem(_menuItems[menuVersion][i].amount);
    }

    return (menu, items);
  }
}
