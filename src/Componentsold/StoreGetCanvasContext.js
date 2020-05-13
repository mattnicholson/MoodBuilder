import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetCanvasContext({ children }) {
  const element = useStore(state =>
    state.getElement({ id: [state.canvasContextID] })
  );
  return children({ element: element });
}
