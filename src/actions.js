import { api, defaults } from "./store.js";

const get = api.getState;
const set = api.getState().set;
const updateElement = api.getState().updateElement;
const addElement = api.getState().addElement;
const deleteElement = api.getState().deleteElement;
const duplicateElement = api.getState().duplicateElement;
const addChildren = api.getState().addChildren;

let actions = {
  DELETE_ELEMENT: args => {
    console.log("DELETE_ELEMENT", args);
    deleteElement(args.id);
  },
  DUPLICATE_ELEMENT: args => {
    console.log("DUPLICATE_ELEMENT", args);
    duplicateElement(args.id);
  },
  /*

  Update an element without state variant

  */
  UPDATE_ELEMENT: args => {
    updateElement(args.id, args.data);
  },
  /*

  Update a state variant element using the current activeStateID

  */
  UPDATE_ACTIVE_STATE_VARIANT: args => {
    let activeStateID = get().activeStateID;

    updateElement(args.id, { data: args.data, state: activeStateID });
  },
  /*

  Update a state variant element using the current activeStateID

  */
  ADD_KEYFRAME_TO_ELEMENT: args => {
    let element = get().elements[args.id];
    let blank = [];
    let variant = element.variants.hasOwnProperty(args.state)
      ? element.variants[args.state]
      : {};

    let keyframes = variant.hasOwnProperty("keyframes")
      ? variant.keyframes
      : blank;

    let copy = [...keyframes];
    // Add keyframe for this element
    addElement(
      {
        type: "Keyframe",
        title: `${element.title} Properties ${copy.length + 1}`,
        pos: args.value,
        ref: element.id,
        data: {}
      },
      keyframe => {
        let newframes = copy.concat([keyframe.id]);
        console.log("keyframes", newframes, args.state);
        updateElement(element.id, {
          data: { keyframes: newframes },
          state: args.state
        });
      }
    );
  },
  /*

  Add a file element to the project

  */
  ADD_FILE_BLOB: (args, callback) => {
    console.log("ADD_FILE_BLOB", args);

    let parentID = get().activeProjectID;
    let file = args.file;

    let url = URL.createObjectURL(file);
    // Work out the extension
    let extension = file.name
      .split(".")
      .pop()
      .toLowerCase();
    // Add a temporary item to the store while we create a solid reference in firebase
    addElement(
      {
        title: file.name,
        filename: file.name,
        extension: extension,
        url: url,
        parent: parentID,
        type: "File"
      },
      // Callback function triggered after the store adds the new element
      element => {
        // Check if a <FileUploader onFileUpload /> function supplied
        if (callback) {
          callback(element);
        }

        // Store to firebase
        let storageRef = window.firebase.storage().ref();
        // Get user
        //let user = window.firebase.auth().currentUser;

        // Reference to storage path
        var pathRef = storageRef.child(
          `${parentID}/${element.id}/${file.name}`
        );

        // Uplaod the file
        try {
          pathRef.put(file).then(snapshot => {
            pathRef.getDownloadURL().then(downloadURL => {
              // Got a final URL, update teh element in the store
              let url = downloadURL;
              updateElement(element.id, {
                url: url
              });
            });
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
  },
  /*

  Add a file ref to current context

  */
  ADD_FILE_REF: args => {
    console.log("ADD_FILE_REF", args);
    let file = args.file;
    let extension = file.extension
      ? file.extension
      : file.title
          .split(".")
          .pop()
          .toLowerCase();
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        action("ADD_IMAGE", { parent: args.parent, fileRef: file.id });
        return;
    }
  },
  /*

  Add a blank element to a layout

  */
  ADD_PAGE: args => {
    let parent = get().elements[args.parent];

    addElement(
      {
        type: "Page",
        title: `Page ${parent.children.length + 1}`,
        parent: parent.id
      },
      page => {
        // Add the page to the project
        addChildren(parent.id, [page.id]);
        action("ADD_LAYER", { parent: page.id });
      }
    );
  },
  /*

  Add a layer to an element

  */
  ADD_LAYER: args => {
    let parent = get().elements[args.parent];
    addElement(
      {
        type: "Layer",
        title: `Layer ${parent.children.length + 1}`,
        parent: parent.id,
        data: {
          w: 18,
          h: 18,
          x: 0,
          y: 0
        }
      },
      layer => {
        // Add the layer to the element
        addChildren(parent.id, [layer.id]);
      }
    );
  },
  /*

  Add a state to an element

  */
  ADD_STATE: args => {
    let parent = get().elements[args.parent];
    addElement(
      {
        type: "State",
        title: `State ${parent.children.length + 1}`,
        parent: parent.id
      },
      state => {
        // Add the state to the element
        addChildren(parent.id, [state.id]);
      }
    );
  },
  /*

  Activate a page for editing

  */
  SET_ACTIVE_PAGE: args => {
    let elements = get().elements;
    let activatePage = elements[args.id];

    // Set the context for 'context actions' (actoins that apply to a current global state such as selected element, layer or page)
    let contextID = activatePage.children.length
      ? activatePage.children[0]
      : args.id;

    set(state => {
      state.activePageID = args.id;
      state.canvasContextID = args.id;
      state.actionContextID = contextID;
      state.activeStateID = defaults.STATE_INITIAL_ID;
      state.selectedElementID = 0;
    });
  },
  /*

  Activate a state for editing

  */
  SET_ACTIVE_STATE: args => {
    let elements = get().elements;
    let activateState = args.id ? elements[args.id] : null;

    // If such an element exists, set it t the active state, otherwise set no active state (default)
    set(state => {
      state.activeStateID = activateState ? args.id : defaults.STATE_INITIAL_ID;
    });
  },
  /*

  Set the action context for selections, additions etc

  */
  SET_ACTION_CONTEXT: args => {
    let contextID = args.id;

    set(state => {
      state.actionContextID = contextID;
      state.selectedElementID = 0;
    });
  },
  /*

  Select an element for manipulation

  */
  SET_SELECTED_ELEMENT: args => {
    let selectedElementID = args.id;
    let currentSelection = get().selectedElementID;

    if (currentSelection != selectedElementID) {
      set(state => {
        state.selectedElementID = selectedElementID;
      });
    }
  },
  /*

  Call another action, passing the current actioncontextID as a parameter

  */
  CONTEXT_ACTION: args => {
    let actionContextID = get().actionContextID;
    console.log("CONTEXT_ACTION", args);
    let ACTION = args.action;
    let data = args.data ? { ...args.data } : {};
    action(ACTION, {
      ...data,
      parent: actionContextID
    });
  },
  /*

  Toggle Grid Edit Views

  */
  TOGGLE_GRID_VIEWS: args => {
    let active = get().activeProjectID;
    console.log("TOGGLE_GRID_VIEWS", args);
    set(state => {
      state.elements[active].settings.showGrid =
        args.active.indexOf("show") != -1;
      state.elements[active].settings.showGridSettings =
        args.active.indexOf("settings") != -1;
    });
  },
  /*

  Update grid padding 

  */
  UPDATE_GRID_PADDING: args => {
    let active = get().activeProjectID;
    let project = get().elements[active];
    if (
      JSON.stringify(project.settings.containerPadding) !=
      JSON.stringify(args.value)
    ) {
      console.log("UPDATE PADDING", args);
      set(state => {
        state.elements[active].settings.containerPadding = args.value;
      });
    }
  },
  /*

  Update grid margins 

  */
  UPDATE_GRID_MARGINS: args => {
    let active = get().activeProjectID;
    let project = get().elements[active];
    if (JSON.stringify(project.settings.margin) != JSON.stringify(args.value)) {
      console.log("UPDATE MARGINS", args);
      set(state => {
        state.elements[active].settings.margin = args.value;
      });
    }
  },
  /*

  Update grid columns 

  */
  UPDATE_GRID_COLS: args => {
    console.log("UPDATE GRID COLS", args);
    let active = get().activeProjectID;
    let project = get().elements[active];
    if (project.settings.cols != args.value) {
      set(state => {
        state.elements[active].settings.cols = args.value;
      });
    }
  },
  /*

  Store a JSON representation of a layout

  */
  SAVE_LAYOUT: args => {
    console.log("SAVE_LAYOUT", args);
    updateElement(args.element, {
      //layout: { ...args.layout },
      layoutJSON: JSON.stringify(args.layout)
    });
  },
  /*

  Add a blank element to a layout

  */
  ADD_BLANK_TO_LAYOUT: args => {
    addElement(
      {
        type: "Layout Item",
        title: `Layout Item`,
        parent: args.parent,
        data: {
          w: 18,
          h: 18,
          x: 0,
          y: 0
        }
      },
      container => {
        // Add the container to the page
        addChildren(args.parent, [container.id]);
      }
    );
  },
  /*

  Add a blank box

  */
  ADD_BLANK_BOX: (args, callback) => {
    addElement(
      {
        type: "Box",
        title: args.title ? args.title : `Box`,
        parent: args.parent,
        data: {
          w: 18,
          h: 18,
          x: 0,
          y: 0
        }
      },
      created => {
        // Add the created element to the parent

        addChildren(args.parent, [created.id]);

        if (callback) callback(created);
      }
    );
  },
  /*

  Add a blank text box

  */
  ADD_TEXT: args => {
    action("ADD_BLANK_BOX", { parent: args.parent, title: "Text Box" }, box => {
      console.log("created blank container for text", box);
      addElement(
        {
          type: "Text",
          title: `Text`,
          parent: box.id,
          data: {
            text: "Lorem ipsum dolor sit amet"
          }
        },
        created => {
          // Add the created element to the parent
          addChildren(box.id, [created.id]);
        }
      );
    });
  },
  /*

  Add a blank image box

  */
  ADD_IMAGE: args => {
    console.log("ADD_IMAGE", args);

    let fileRef = args.fileRef ? args.fileRef : null;

    action(
      "ADD_BLANK_BOX",
      { parent: args.parent, title: "Image Box" },
      box => {
        addElement(
          {
            type: "Image",
            title: `Image`,
            parent: box.id,
            data: {
              fileRef: fileRef
            }
          },
          created => {
            // Add the created element to the parent
            addChildren(box.id, [created.id]);
          }
        );
      }
    );
  },
  /*

  Add a blank arrangement

  */
  ADD_ARRANGEMENT: args => {
    action(
      "ADD_BLANK_BOX",
      { parent: args.parent, title: "Arrangement Box" },
      box => {
        addElement(
          {
            type: "Arrangement",
            title: `Arrangement`,
            parent: box.id,
            data: {
              fileRef: null
            }
          },
          created => {
            // Add the created element to the parent
            addChildren(box.id, [created.id]);
          }
        );
      }
    );
  },
  /*

  Toggle a boolean value for an arbitrary element parameter

  */
  TOGGLE_ELEMENT_PROP: args => {
    let newVal = !!!args.element[args.prop];
    let save = {};
    save[args.prop] = newVal;
    updateElement(args.element.id, save);
  },
  /*

  Open a Dialog and trigger the {action} on confirm

  */
  CONFIRM: args => {
    set(state => {
      state.dialogOpen = true;
      // Make a copy of the context in case it changes as a result of the action
      state.contextForDialog = { ...state.elements[args.params.id] };
      state.pendingDialog = { action: args.action, params: args.params };
    });
  },
  /*

  Hide the Dialog

  */
  CLOSE_DIALOG: args => {
    set(state => {
      state.dialogOpen = false;
    });
  },
  /*

  Context Menu Trigger for Right-Click

  */
  OPEN_CONTEXT_MENU: args => {
    set(state => {
      state.contextMenuOpen = true;
      state.contextForMenu = { ...state.elements[args.id] };
      state.mouseX = args.x;
      state.mouseY = args.y;
    });
  },
  CLOSE_CONTEXT_MENU: args => {
    set(state => {
      state.contextMenuOpen = false;
    });
  },
  CONTEXT_MENU_DELETE: args => {
    action("CONFIRM", {
      action: "DELETE_ELEMENT",
      params: { id: args.id }
    });
  },
  CONTEXT_MENU_DUPLICATE: args => {
    action("DUPLICATE_ELEMENT", { id: args.id });
  }
};

export default function action(label, args, callback) {
  if (actions.hasOwnProperty(label)) actions[label](args, callback);
}
