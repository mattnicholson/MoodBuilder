import React, { useEffect, useState } from "react";
import Element from "./Element.js";
import useStore from "../../store.js";

import "../../Styles/Layout.scss";

export default function Container({ element, children }) {
  const elements = useStore(state =>
    state.getElements({ id: element.children })
  );

  const boxes = elements.map((element, ix) => (
    <Element element={element} key={element.id} />
  ));

  return (
    <div
      style={{
        position: "absolute",
        top: `${element.y}px`,
        left: `${element.x}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        overflow: "hidden"
      }}
      className="Layout-item"
      data-fill="cover"
      key={`Container_${element.id}`}
    >
      {boxes}
    </div>
  );
}
