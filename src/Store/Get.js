import React, { useEffect, useState } from "react";
import useStore from "./store.js";

export default function GetElements({ children, id, type = [] }) {
  const elements = useStore(state => state.elements);
  return children({
    table: elements,
    elements: Object.values(elements)
  });
}
