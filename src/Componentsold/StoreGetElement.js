import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetElement({ children, id }) {
  const element = useStore(state => state.getElement({ id: [id] }));

  return children({ element });
}
