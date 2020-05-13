import React from "react";

import action from "../actions";
import icons from "../icons";

export default function ActionDelete({ element, icon }) {
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    action("CONFIRM", {
      action: "DELETE_ELEMENT",
      params: { id: element.id }
    });
  };

  return <div onClick={handleClick}>{icons["delete"].icon}</div>;
}
