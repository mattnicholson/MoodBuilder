import React, { useEffect, useState } from "react";
import useStore from "../store.js";
import { expandElement } from "../store.js";

export default function StoreExpandElement({ children, element, state }) {
  const latest = useStore(state => state.elements[element.id]);
  const expanded = expandElement({ element: latest, state: state });
  return children({ element: expanded });
}
