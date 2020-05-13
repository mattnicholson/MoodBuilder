import React, { useEffect, useState } from "react";
import { api } from "../store.js";

let autosaved = JSON.parse(window.localStorage.getItem("state"));

let INIT = 0;

export default function AutoSave({ page }) {
  useEffect(() => {
    if (!INIT) {
      INIT = 1;
      const unsub = api.subscribe(state => {
        window.localStorage.setItem("state", JSON.stringify(state));
      });
    }
    // Specify how to clean up after this effect:
    /*return function cleanup() {
      unsub();
    };*/
  });

  return null;
}

export { autosaved };
