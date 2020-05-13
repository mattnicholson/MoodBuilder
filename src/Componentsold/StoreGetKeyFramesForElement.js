import React, { useEffect, useState } from "react";
import useStore from "../store.js";

export default function StoreGetElement({ children, id, state: state }) {
  const element = useStore(state => state.getElement({ id: [id] }));

  let blank = [];
  let variant = element.variants.hasOwnProperty(state)
    ? element.variants[state]
    : {};

  let keyframes = variant.hasOwnProperty("keyframes")
    ? variant.keyframes
    : blank;

  return children({ keyframes });
}
