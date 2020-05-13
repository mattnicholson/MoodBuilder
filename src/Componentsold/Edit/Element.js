import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";

import Container from "./Container";
import File from "./File";
import Box from "./Box";
import Arrangement from "./Arrangement";

import StoreExpandElement from "../StoreExpandElement";
import StoreGetActionContext from "../StoreGetActionContext";
import StoreGetElements from "../StoreGetElements";
import StoreGetElement from "../StoreGetElement";
import OpenContextMenu from "../OpenContextMenu";

import action from "../../actions.js";

import "../../Styles/Layout.scss";

function Children({ element, state }) {
  if (!element.children.length) return null;
  return (
    <StoreGetElements id={element.children}>
      {({ elements }) =>
        elements.map((item, ix) => (
          <Element element={item} index={ix} state={state} />
        ))
      }
    </StoreGetElements>
  );
}

function Output({ element, index, state }) {
  //return <div>{JSON.stringify(element)}</div>;
  switch (element.type) {
    case "Box":
    case "Layer":
      return (
        <Box element={element}>
          <div>
            <Children element={element} state={state} />
          </div>
        </Box>
      );
    case "Containeroff":
    case "Layout Itemoff":
      return <Container element={element} />;
    case "Fileoff":
      return <File element={element} />;
    case "Arrangement":
      return <Arrangement element={element} />;
    case "Image":
      return (
        <div data-pointer="none">
          {element.data.fileRef ? (
            <StoreGetElement id={element.data.fileRef}>
              {({ element }) => (
                <img
                  style={{ display: "block", width: "100%" }}
                  src={element.url}
                />
              )}
            </StoreGetElement>
          ) : (
            <img
              style={{ display: "block", width: "100%" }}
              src="data:image/png;base64,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"
            />
          )}
        </div>
      );
    case "Text":
      return (
        <div>
          <h1 style={{ color: "black" }}>
            {/*element.data.text*/}Lorem ipsum dolor sit amet
          </h1>
        </div>
      );
    case "Layer":
      return (
        <StoreGetActionContext>
          {({ actionContextID }) => (
            <div
              className="Layer"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: !index ? 1 : 0,
                minHeight: "300vh",
                pointerEvents: element.id == actionContextID ? "all" : "none"
                //opacity: element.id == actionContextID ? 1 : 0.5
                //zIndex: element.id == actionContextID ? 99 : null
              }}
            >
              <div
                className="Layer-content"
                style={{
                  //position: !index ? "fixed" : "relative",

                  height: "50px"
                  //background: "rgba(255,0,0,7)"
                }}
              >
                <Children element={element} state={state} />
              </div>
            </div>
          )}
        </StoreGetActionContext>
      );
    default:
      return (
        <div
          style={{
            color: "black",
            padding: 5
          }}
        >
          <span
            style={{
              background: "white",
              padding: "2px",
              display: "inline-block",
              border: "1px dotted"
            }}
          >
            {element.title}
          </span>
          <div
            style={{
              position: "relative",
              border: "1px solid black",
              padding: "5px",
              background: "rgba(255,0,0,0.1)"
            }}
          >
            <Children element={element} />
          </div>
        </div>
      );
  }
}

{
  /* <SizeMe>{size => <Output element={element} />}</SizeMe> */
}
export default function Element({ element, wrapper, index, state }) {
  //return <ContextMenu />;
  if (element.hidden) return null;

  return (
    <div
      onClick={e => {
        if (["Layer", "Box"].indexOf(element.type) != -1) {
          e.stopPropagation();
          action("SET_SELECTED_ELEMENT", { id: element.id });
        }
      }}
    >
      <StoreExpandElement element={element} state={state}>
        {({ element }) => {
          if (wrapper) {
            return wrapper(
              <Output element={element} index={index} state={state} />
            );
          } else {
            return <Output element={element} index={index} state={state} />;
          }
        }}
      </StoreExpandElement>
    </div>
  );
}
