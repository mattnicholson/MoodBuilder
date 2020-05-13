import React, { useEffect, useState } from "react";
import DraggableBox from "../DraggableBox";

import EditableElement from "./Element.js";

import useStore from "../../store.js";

export default function Container({ element, children }) {
  const [files, setFiles] = useState([]);

  const editProject = useStore(state =>
    state.getElement({ id: [state.activeProjectID], type: ["Project"] })
  );

  const addElement = useStore(state => state.addElement);
  const updateElement = useStore(state => state.updateElement);
  const addChildren = useStore(state => state.addChildren);

  const elements = useStore(state =>
    state.getElements({ id: element.children })
  );

  const boxes = elements.map((element, ix) => (
    <EditableElement
      element={element}
      key={element.id}
      wrapper={children => {
        return (
          <div data-layout="fluid" data-fill="cover" data-pointer="none">
            {children}
          </div>
        );
      }}
    />
  ));

  return <div data-layout="fluid">{boxes}</div>;
  return (
    <DraggableBox
      key={`Container_${element.id}`}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      onDragStop={({ x, y }) => updateElement(element, { x, y })}
      onResizeStop={({ width, height, x, y }) =>
        updateElement(element, { width, height, x, y })
      }
    >
      {boxes}
    </DraggableBox>
  );
}
