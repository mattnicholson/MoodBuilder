import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DraggableBox from "../DraggableBox";
import ElementProperties from "../ElementProperties";

import EditableElement from "./Element.js";

import useStore from "../../store.js";
import action from "../../actions.js";

export default function Container({ element, children }) {
  const [files, setFiles] = useState([]);

  const editProject = useStore(state =>
    state.getElement({ id: [state.activeProjectID], type: ["Project"] })
  );

  const addElement = useStore(state => state.addElement);
  const updateElement = useStore(state => state.updateElement);
  const addChildren = useStore(state => state.addChildren);

  const selectedElementID = useStore(state => state.selectedElementID);
  const activeStateID = useStore(state => state.activeStateID);

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

  let isSelected = selectedElementID == element.id;
  if (!isSelected || 1) {
    let variants = {};

    variants["__initial__"] = {
      y: [null, `${40}px`],
      rotateY: [null, -20],
      rotateX: [null, -20],
      scale: [null, 0.25],
      //x: [null, `${200}px`],
      height: [null, `${150}px`],
      width: [null, `50%`],
      backgroundColor: [null, "#FF0000", "#00FF00", "#0000FF"],
      borderRadius: [null, `${0}%`],
      opacity: [null, parseFloat(0)]
    };

    variants["__active__"] = {
      y: [null, `${20}px`],
      //x: [null, `${0}px`],
      rotateY: [null, 0],
      rotateX: [null, 0],
      scale: [null, 1],
      height: [null, `${250}px`],
      width: [null, `50%`],
      //height: [null, `${200}px`],
      //width: [null, `${500}px`],
      backgroundColor: [null, "#FF0000", "#00FFFF", "#FF00FF"],
      borderRadius: [null, `${10}px`],
      opacity: [null, parseFloat(1)]
    };
    return (
      <ElementProperties element={element}>
        {data => (
          <motion.div
            className="Layout-box"
            initial={false}
            animate={activeStateID}
            variants={variants}
            style={{
              transformOrigin: "50% 50%"
            }}
            transition={{
              //y: { yoyo: Infinity },
              //y: { type: "spring", mass: 0.5 },
              //rotateY: { ease: "easeOut", duration: 0.6 },
              backgroundColor: {
                times: [0, 0.2, 0.7, 1],
                ease: "easeInOut",
                duration: 3,
                yoyo: Infinity
              },
              default: {
                duration: 0.8,
                // inOutQuint
                ease: [0.83, 0, 0.17, 1],
                // out Expo
                ease: [0.16, 1, 0.3, 1]
                //ease: "easeOut"
              }
            }}
          >
            <>
              <div style={{ color: "black", display: "none" }}>
                {JSON.stringify(data)}
              </div>
              {children}
            </>
          </motion.div>
        )}
      </ElementProperties>
    );
  } else {
    return (
      <ElementProperties element={element}>
        {data => (
          <DraggableBox
            key={`Box_${element.id}`}
            x={data.x}
            y={data.y}
            disabled={false}
            className="Layout-box"
            width={data.w}
            height={data.h}
            style={{
              backgroundColor: data.background
            }}
            onDragStop={({ x, y }) =>
              action("UPDATE_ACTIVE_STATE_VARIANT", {
                id: element.id,
                data: { x, y }
              })
            }
            onResizeStop={({ width, height, x, y }) =>
              action("UPDATE_ACTIVE_STATE_VARIANT", {
                id: element.id,
                data: { w: width, h: height, x, y }
              })
            }
          >
            {children}
          </DraggableBox>
        )}
      </ElementProperties>
    );
  }
}
