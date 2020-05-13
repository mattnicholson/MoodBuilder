import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetElements({ children, id, type = [] }) {
  if (!id) return null;
  const elements = useStore(state => state.getElements({ id: id, type }));

  return children({ elements });
}
