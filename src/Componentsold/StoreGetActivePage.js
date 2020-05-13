import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetActivePage({ children }) {
  const page = useStore(state =>
    state.getElement({ id: [state.activePageID] })
  );

  return children({ page });
}
