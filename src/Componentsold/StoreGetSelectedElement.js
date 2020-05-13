import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetSelectedElement({ children }) {
  const selectedElement = useStore(state =>
    state.getElement({ id: [state.selectedElementID] })
  );

  return children({ element: selectedElement });
}
