import React, { useState } from "react";
import create from "zustand";
import produce from "immer";
import uniqueID from "./Utils/id";
import { autosaved } from "./Components/AutoSave";

const defaults = {
  STATE_INITIAL_ID: `__initial__`,
  STATE_ACTIVE_ID: `__active__`,
  PROJECT_ID: `__demo__`,
  NO_PARENT_ID: 0,
  NO_VARIANTS: ["Project", "Page", "File", "Keyframe"]
};

let defaultSettings = {
  // Breakpoints
  cols: 18,
  margin: [10, 10],
  containerPadding: [10, 10]
};

let defaultState = {
  elements: {
    __demo__: {
      id: defaults.PROJECT_ID,
      title: "Demo Project",
      children: [],
      type: "Project",
      parent: defaults.NO_PARENT_ID,
      settings: { ...defaultSettings }
    },
    __initial__: {
      id: defaults.STATE_INITIAL_ID,
      title: "Initial",
      children: [],
      type: "State",
      parent: defaults.NO_PARENT_ID
    },
    __active__: {
      id: defaults.STATE_ACTIVE_ID,
      title: "Active",
      children: [],
      type: "State",
      parent: defaults.NO_PARENT_ID
    }
  },
  activeProjectIx: 0,
  activeProjectID: defaults.PROJECT_ID,
  activeStateID: defaults.STATE_INITIAL_ID,
  activePageIx: 0,
  activePageID: 0,
  activeLayerIx: 0,
  activeLayerID: 0
};

let initState = !autosaved ? defaultState : autosaved;
initState.elements = { ...initState.elements, ...defaultState.elements };

// Make sure demo settings are up to date
if (!initState.elements["__demo__"].hasOwnProperty("settings"))
  initState.elements["__demo__"].settings = { ...defaultSettings };

const [useStore, api] = create((set, get) => {
  return {
    ...initState,
    set: fn => set(produce(fn)),
    /*

    CRUD API
    -------------------------------
    addElement, getElement(s), updateElement, deleteElement

    */
    // CREATE a blank element (everything is an element, it just has a different type)
    addElement: (args, callback) => {
      let element = { ...args };

      // Required properties
      if (!element.hasOwnProperty("title")) element.title = "New Element";
      if (!element.hasOwnProperty("type")) element.type = "Element";

      const hasVariants = defaults.NO_VARIANTS.indexOf(element.type) == -1;

      // Children array store the order of nested elements as IDs
      // Parent stores the single node ID that the element belongs to
      if (!element.hasOwnProperty("children")) element.children = [];
      if (!element.hasOwnProperty("parent"))
        element.parent = defaults.NO_PARENT_ID;
      // Data stores the individual user-defined options for this element
      if (!element.hasOwnProperty("data")) element.data = {};

      // Variant elements store their data in keyframes across state keys
      let keyframeData = {};
      if (hasVariants) {
        // Copy the keyframe data
        keyframeData = { ...element.data };
        // Delete the original data argument
        delete element.data;

        // Variants store user-defined options for different page or element states
        if (!element.hasOwnProperty("variants")) element.variants = {};
        // Ensure the element variant has an initial state with a keyframes property
        if (!element.variants.hasOwnProperty(defaults.STATE_INITIAL_ID))
          element.variants[defaults.STATE_INITIAL_ID] = { keyframes: [] };
      }

      let id = uniqueID();
      element.id = id;

      const set = get().set;
      const addElement = get().addElement;
      const updateElement = get().updateElement;

      set(state => {
        state.elements[element.id] = element;
      });

      if (hasVariants) {
        console.log("Added element", element);
        // Add keyframe for this element
        addElement(
          {
            type: "Keyframe",
            title: `${element.title} Properties`,
            pos: 0,
            ref: id,
            data: keyframeData
          },
          keyframe => {
            updateElement(
              element.id,
              {
                data: { keyframes: [keyframe.id] },
                state: defaults.STATE_INITIAL_ID
              },
              () => {
                console.log("Keyframe callback", keyframe, get().elements);
                if (callback) {
                  callback(element);
                }
              }
            );
          }
        );
      } else {
        console.log("Added element", element);
        if (callback) {
          callback(element);
        }
      }
    },
    // READ: Lookup elements e.g {id:['25'],type:['Project']}
    getElements: criteria => {
      let elements = get().elements;
      let set = criteria.id
        ? criteria.id.map(id => elements[id])
        : Object.values(elements);

      return set.filter(element => {
        if (typeof element == "undefined") return false;
        let matches = 0;
        let keys = Object.keys(criteria);
        keys.forEach(k => {
          if (!element.hasOwnProperty(k)) return;
          let v = criteria[k];
          if (!v) return;
          if (typeof v == "undefined") return;
          if (!v.length || v.indexOf(element[k]) != -1) matches++;
        });
        return matches == keys.length;
      });
    },
    // READ: Lookup elements but return first match
    getElement: criteria => {
      let results = get().getElements(criteria);
      return results.length ? results[0] : results;
    },
    // UPDATE element
    updateElement: (id: String, args, callback) => {
      if (id.hasOwnProperty("id")) {
        throw "id not a string";
      }
      // Get the latest version of the element we are deleting
      const element = get().elements[id];
      const set = get().set;

      console.log("updateElement", element);
      let save;
      let stateData = null;
      let defaultData = null;

      let suppliedData = { ...args.data } || {};
      delete args.data;

      // Just updating overrides properties for a specific state
      if (args.hasOwnProperty("state")) {
        save = { ...element };

        // State has a value
        if (args.state) {
          let variants = { ...element.variants };
          let stateData = { ...variants[args.state], ...suppliedData };
          variants[args.state] = stateData;
          save.variants = variants;
          // Default state - data to save will be in args.data
        } else {
          let existingData = { ...element.data };
          defaultData = { ...existingData, ...suppliedData };
          save.data = defaultData;
        }

        console.log("will save", save, args);
        // No data supplied - data to save will be the args as supplied
      } else {
        save = { ...element, ...args };
        let saveData = { ...element.data, ...suppliedData };
        save.data = saveData;
      }

      // Dont update ID
      if (save.hasOwnProperty("id")) delete save.id;

      save.id = element.id;
      save.updated = Date.now();

      set(state => {
        state.elements[element.id] = save;
      });

      if (callback) {
        callback(element);
      }
    },
    // COPY element by id and all children
    duplicateElement: (id, callback) => {
      // Get the latest version of the element we are deleting
      const element = get().elements[id];
      const elements = get().elements;
      const flattenTree = get().flattenTree;

      let save = { ...elements };

      // Get the general set function to update the store with immer
      const set = get().set;

      let flattened = flattenTree(element);
      let map = {}; // map[oldId] : newId
      // Flat set of copies of the whole tree
      let copies = {};
      flattened.forEach(oldId => {
        let copy = { ...elements[oldId] };
        let newId = uniqueID();
        copy.id = newId;
        copies[oldId] = copy;
        map[oldId] = newId;
      });

      Object.keys(copies).forEach(oldId => {
        let ref = copies[oldId];
        let copy = { ...ref };
        copy.children = ref.children
          ? ref.children.map(oldId => map[oldId])
          : [];
        copy.parent = ref.parent ? map[copy.parent] : null;

        save[copy.id] = copy;
      });

      // Get the id of the new copy of the root element from this function
      let newRootId = map[id];

      // Add a copy label to the duplicate
      save[newRootId].title += " (copy)";
      // Ensure the root element gets the same parent as the duplicated one
      save[newRootId].parent = element.parent;

      // Insert the copy into the child array of the parent

      let parentId = element.parent ? element.parent : null;

      let newChildren = [...elements[parentId].children];
      let ix = newChildren.indexOf(id);

      newChildren.splice(ix + 1, 0, newRootId);
      let parent = { ...save[parentId] };
      parent.children = newChildren;
      parent.updated = Date.now();

      save[parentId] = parent;

      // Overwrite the elements in the store with immer
      set(state => {
        state.elements = save;
      });
    },
    // Create one long array of all items in the subtree from this item down
    flattenTree: element => {
      let tree = [];
      tree.push(element.id);

      // Define Recursive function to push child IDs on to the list
      function flattenChildren(children) {
        if (!children.length) return null;
        let expanded = get().getElements({ id: children });
        if (expanded) {
          expanded.forEach(child => {
            tree.push(child.id);
            flattenChildren(child.children);
          });
        }
      }

      // Call the recursive function on the immediate children
      flattenChildren(element.children);

      return tree;
    },
    // DELETE element by id and all children
    deleteElement: (id, callback) => {
      // Get the latest version of the element we are deleting
      const element = get().elements[id];

      // Get the general set function to update the store with immer
      const set = get().set;

      // make a blank object ofr all deletions (nested items)
      let deletions = [];

      // Add the item to the list
      deletions.push(id);

      // Define Recursive function to push child IDs on to the deletion list
      function deleteChildren(children) {
        if (!children.length) return null;
        let expanded = get().getElements({ id: children });
        if (expanded) {
          expanded.forEach(child => {
            deletions.push(child.id);
            deleteChildren(child.children);
          });
        }
      }

      // Call the recursive function on the immediate children
      deleteChildren(element.children);

      // Get all elements from the store
      let elements = get().elements;

      // Clone the existing element store
      let keep = { ...elements };

      // Remove the items we no longer want (the element passed in and all nested children)
      deletions.forEach(id => {
        delete keep[id];
      });

      // Overwrite the elements in the store with immer
      set(state => {
        state.elements = keep;
      });
    },
    // Add Children
    addChildren: (id, additions) => {
      const elements = get().elements;
      const parent = elements[id];

      let children = [...parent.children];
      children = children.concat(additions);

      const set = get().set;
      set(state => {
        state.elements[id].children = children;
      });
    },

    // Push a blank page onto the current project
    addPage: () =>
      set(
        produce(state => {
          state.projects[state.activeProjectIx].pages.push({
            title: `Page ${state.projects[0].pages.length + 1}`
          });
        })
      ),
    // Push a file blob reference to the active project
    addFile: url =>
      set(
        produce(state => {
          state.projects[state.activeProjectIx].files.push({
            url: url
          });
        })
      )
  };
});

function hasVariants(type) {
  return defaults.NO_VARIANTS.indexOf(type) == -1;
}

// Merge the settings from the variants for a given state key into the elements data values
function expandElement({ element, state }) {
  let copy = { ...element };
  let variant = null;
  if (state && element.hasOwnProperty("variants")) {
    variant = element.variants.hasOwnProperty(state)
      ? element.variants[state]
      : null;
  }

  if (variant) {
    copy.data = { ...element.data, ...variant };
    copy.default = { ...element.data };
  }

  return copy;
}

export default useStore;
export { api, expandElement, defaults, hasVariants };
