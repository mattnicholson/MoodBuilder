import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetActionContext({ children }) {
  const actionContextID = useStore(state => state.actionContextID);

  return children({ actionContextID: actionContextID });
}
