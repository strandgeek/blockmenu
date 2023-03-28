// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


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

  // Menu Version -> Item Idx -> Menu Item
  mapping(uint => mapping(uint => MenuItem)) _menuItems;



  /**
   * @dev Throws error if the menu does not exist yet
   */
  function _checkMenuExists() internal view {
    if (menuVersion == 0) {
      revert('no menu created yet');
    }
  }

  /**
   * @dev Throws error if the item idx does not exist in the current menu
   */
  function _checkMenuItemIdx(uint itemIdx) internal view {
    _checkMenuExists();
    Menu storage menu = _menus[menuVersion];
    require(itemIdx < menu.itemsTotal, 'item not in menu');
  }


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
    _checkMenuExists();
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
