import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetActiveState({ children }) {
  const state = useStore(state =>
    state.getElement({ id: [state.activeStateID] })
  );

  return children({ state });
}
