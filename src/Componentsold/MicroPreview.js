import React from "react";
import RenderPage from "./RenderPage";
import { Hidden } from "@material-ui/core";

export default function MicroPreview({ page, state = 0, size = 110 }) {
  return (
    <div>
      <div
        style={{
          width: size,
          height: size * 0.6,
          border: `1px solid black`,
          position: `relative`,
          overflow: "hidden",
          background: `white`,
          margin: `0`
        }}
      >
        <div
          style={{
            width: `100vw`,
            height: `60vw`,
            position: `absolute`,
            transformOrigin: `0 0`,
            top: 0,
            left: 0,
            transform: `scale3d(${size / window.innerWidth},${size /
              window.innerWidth},1)`,
            overflow: "hidden",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 0
            }}
          >
            <RenderPage page={page} state={state} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1,
              pointerEvents: "all"
            }}
          />
        </div>
      </div>
    </div>
  );
}
