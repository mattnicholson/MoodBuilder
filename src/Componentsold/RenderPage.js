import React, { useEffect, useState } from "react";

import Element from "./Edit/Element.js";
import useStore from "../store.js";

import Canvas from "./Canvas";

export default function RenderPage({ page, state = 0 }) {
  const elements = useStore(state => state.getElements({ id: page.children }));

  const boxes = elements.map((element, ix) => (
    <Element element={element} key={`render_${element.id}`} />
  ));

  return (
    <section
      className="container"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <Canvas page={page} state={state} />
    </section>
  );
}
