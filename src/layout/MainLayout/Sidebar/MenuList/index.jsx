import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| MENULIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return null;
    }
  });

  return navItems;
};

export default MenuList;
