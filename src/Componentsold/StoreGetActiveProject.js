import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetActiveProject({ children }) {
  const project = useStore(state =>
    state.getElement({ id: [state.activeProjectID] })
  );

  return children({ project });
}
