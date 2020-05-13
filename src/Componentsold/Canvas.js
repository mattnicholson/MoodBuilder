import React, { useEffect, useState } from "react";
import DraggableBox from "./DraggableBox";
import FileUploader from "./FileUploader";
import EditLayout from "./EditLayout";
import EditableElement from "./Edit/Element.js";
import useStore from "../store.js";
import action from "../actions.js";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

export default function Canvas({ page, state }) {
  const [files, setFiles] = useState([]);

  const editProject = useStore(state =>
    state.getElement({ id: [state.activeProjectID], type: ["Project"] })
  );

  const addElement = useStore(state => state.addElement);
  const updateElement = useStore(state => state.updateElement);
  const addChildren = useStore(state => state.addChildren);

  const elements = useStore(state => state.getElements({ id: page.children }));

  const boxes = elements.map((element, ix) => (
    <EditableElement
      element={element}
      key={`${element.id}`}
      index={ix}
      state={state}
    />
  ));

  return (
    <FileUploader
      parent={editProject}
      onFileUpload={file => {
        action("CONTEXT_ACTION", { action: "ADD_FILE_REF", data: { file } });
      }}
    >
      <div style={{ perspective: `600px` }}>{boxes}</div>
      {/*<EditLayout page={page} />*/}
      {/*
      <section className="container" style={{ minHeight: "100vh" }}>
        {boxes}
        <hr />
        <div style={{ "font-family": "monospace" }}>{JSON.stringify(page)}</div>
      </section>
      */}
    </FileUploader>
  );
}
