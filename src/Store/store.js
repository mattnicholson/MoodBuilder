import React, { useEffect } from "react";
import create from "zustand";
import produce from "immer";
import { devtools, redux } from "zustand/middleware";

import uniqueID from "../Utils/id";

const initialState = {
  elements: {
    __root__: { title: "Root", type: "Root", id: "__root__" },
    __rootlink__: {
      title: "Link",
      type: "Relationship",
      id: "__rootlink__",
      from: "__root__",
      to: "__redbg__",
      relationshipType: "Property"
    },
    __a__: { title: "Element A", type: "Element", id: "__a__" },
    __link__: {
      title: "A-B Link",
      type: "Relationship",
      id: "__link__",
      from: "__a__",
      to: "__b__",
      relationshipType: "Child"
    },
    __rlink__: {
      title: "Red BG",
      type: "Relationship",
      id: "__rlink__",
      from: "__a__",
      to: "__redbg__",
      relationshipType: "Property"
    },
    __bluelink__: {
      title: "Red BG",
      type: "Relationship",
      id: "__bluelink__",
      from: "__b__",
      to: "__bluebg__",
      relationshipType: "Property"
    },
    __olink__: {
      title: "Link",
      type: "Relationship",
      id: "__olink__",
      from: "__a__",
      to: "__opacity__",
      relationshipType: "Property"
      //via: "__opacity__"
    },
    __olink2__: {
      title: "Link",
      type: "Relationship",
      id: "__olink2__",
      from: "__b__",
      to: "__opacity__",
      relationshipType: "Property"
      //via: "__opacity__"
    },
    __b__: { title: "Element B", type: "Element", id: "__b__" },
    __redbg__: {
      title: "Red Background",
      type: "Property",
      id: "__redbg__",
      propertyType: "Background",
      value: "#FF0000"
    },
    __bluebg__: {
      title: "Blue Background",
      type: "Property",
      id: "__bluebg__",
      propertyType: "Background",
      value: "#0000FF"
    },
    __opacity__: {
      title: "50% Opacity",
      type: "Property",
      id: "__opacity__",
      propertyType: "Opacity",
      value: 0.5
    }
  }
};
const types = {
  create_element: "CREATE_ELEMENT",
  delete_element: "DELETE_ELEMENT"
};
const reducer = (state, { type, data }) => {
  const newState = produce(state, draft => {
    switch (type) {
      case types.create_element:
        const id = uniqueID();
        draft.elements[id] = { ...data, id: id };

        break;
      default:
        break;
    }
  });

  return newState;

  return nextState;
};

const [useStore, api] = create(
  // Connects store to devtools
  // Without reducers and action-types you would see "setState" logged out instead
  devtools(
    // Transforms our store into a redux action dispatcher ...
    // Adds a dispatch method to the store as well as to the api
    redux(reducer, initialState)
  )
);

export default useStore;
export { api };
