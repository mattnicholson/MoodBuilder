import React, { useEffect, useState } from "react";
import useStore from "../store.js";
import { useDropzone } from "react-dropzone";
import action from "../actions.js";

export default function FileUploader({
  parent,
  children,
  onFileUpload = () => {}
}) {
  const [files, setFiles] = useState([]);

  const addElement = useStore(state => state.addElement);
  const updateElement = useStore(state => state.updateElement);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    //accept: "image/*",
    onDrop: (acceptedFiles, rejectedFiles, event) => {
      // Nested dropzones override outer dropzones
      event.stopPropagation();

      acceptedFiles.forEach(file => {
        action(
          "ADD_FILE_BLOB",
          {
            file: file
          },
          element => {
            if (onFileUpload) {
              onFileUpload(element);
            }
          }
        );
      });
    }
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div
      {...getRootProps({
        className: "dropzone"
      })}
    >
      {children}
    </div>
  );
}
