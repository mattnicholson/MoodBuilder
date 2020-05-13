import React from "react";

import action from "../actions";

export default function OpenContextMenu({ element, children }) {
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    let x = event.clientX - 2;
    let y = event.clientY - 4;
    action("OPEN_CONTEXT_MENU", {
      id: element.id,
      x,
      y
    });
  };

  return <div onContextMenu={handleClick}>{children}</div>;
}
