import React, { useEffect, useState } from "react";

import ContextMenu from "./ContextMenu.js";

import icons from "../icons";
import mappings from "../mappings";
import action from "../actions";
import useStore from "../store.js";

export default function ContextMenuController({ page }) {
  const targetElement = useStore(state => state.contextForMenu);
  const open = useStore(state => state.contextMenuOpen);
  const top = useStore(state => state.mouseY);
  const left = useStore(state => state.mouseX);

  if (!targetElement) return null;
  let groups = [];

  if (mappings.contextMenuActions.hasOwnProperty(targetElement.type)) {
    groups = mappings.contextMenuActions[targetElement.type].map(group =>
      group.map(key => {
        let item = icons[key];
        return {
          content: (
            <div>
              {item.icon} {item.label}
            </div>
          ),
          onClick: () => {
            action("CLOSE_CONTEXT_MENU");
            action(`CONTEXT_MENU_${key.toUpperCase()}`, {
              id: targetElement.id
            });
          }
        };
      })
    );
  }

  return (
    <ContextMenu
      open={open}
      top={top}
      left={left}
      onClose={() => action("CLOSE_CONTEXT_MENU")}
      groups={groups}
    />
  );
}
