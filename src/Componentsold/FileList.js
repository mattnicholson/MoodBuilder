import React, { useEffect, useState } from "react";
import useStore from "../store.js";
import action from "../actions.js";

const img = {
  display: "block",
  width: "100%"
};

function File({ file }) {
  let ext = file.title
    .split(".")
    .pop()
    .toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "svg":
      return (
        <div
          className="File-preview File-preview--image"
          onClick={() =>
            action("CONTEXT_ACTION", { action: "ADD_FILE_REF", data: { file } })
          }
        >
          <img src={file.url} style={img} />
        </div>
      );

    case "ttf":
      return (
        <div className="File-preview File-preview--font">{file.title}</div>
      );

    default:
      return (
        <div className={`File-preview File-preview--${ext}`}>{file.title}</div>
      );
  }
}

export default function FileList({ page }) {
  const uploads = useStore(state => state.getElements({ type: ["File"] }));

  const images = uploads.reverse().map((file, ix) => (
    <div key={`${ix}_${file.id}`}>
      <File file={file} />
    </div>
  ));

  return <div>{images}</div>;
}
