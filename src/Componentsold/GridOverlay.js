import React from "react";

export default function GridOverlay({ cols, margin, containerPadding }) {
  if (!cols) cols = 1;
  let gutter = parseInt(margin[0]);
  if (isNaN(gutter)) gutter = 0;

  let topSpace = parseInt(containerPadding[1]);
  if (isNaN(topSpace)) topSpace = 0;

  let edgeSpace = parseInt(containerPadding[0]);
  if (isNaN(edgeSpace)) edgeSpace = 0;

  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: topSpace,
        bottom: topSpace,
        left: edgeSpace,
        right: edgeSpace,
        opacity: 0.2,
        zIndex: 999,
        transform: "translate3d(0,0,0)",
        background: "cyan",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      {[...Array(cols)].map(i => (
        <div
          style={{
            height: "100%",
            display: "inline-block",
            verticalAlign: "top",
            width: `calc(${(1 / cols) * 100}% - ${gutter}px)`,
            borderRight: !gutter ? "1px solid white" : "none"
          }}
        >
          <div
            style={{
              height: "100%",
              background: "magenta"
            }}
          />
        </div>
      ))}
    </div>
  );
}
