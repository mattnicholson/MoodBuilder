import React from "react";

import action from "../actions";

export default function ActionToggle({ element, prop, on, off }) {
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    action("TOGGLE_ELEMENT_PROP", {
      element: element,
      prop
    });
  };

  let children = element[prop] ? on : off;

  return <div onClick={handleClick}>{children}</div>;
}
