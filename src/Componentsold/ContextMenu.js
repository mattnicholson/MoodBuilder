import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";

/*

  groups = [
    [
      {
        onClick : () => {},
        content : <ReactComponent />
      }
    ]
  ]

*/

export default function ContextMenu({ open, top, left, onClose, groups = [] }) {
  let items = [];

  groups.forEach((group, gix) => {
    if (gix > 0) items.push(<Divider key={`divider_${gix}`} />);

    group.forEach((item, ix) => {
      items.push(
        <MenuItem key={`menu_item_${gix}_${ix}`} onClick={item.onClick}>
          {item.content}
        </MenuItem>
      );
    });
  });

  return (
    <Menu
      keepMounted
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={top !== null && left !== null ? { top, left } : null}
    >
      {items}
    </Menu>
  );
}
