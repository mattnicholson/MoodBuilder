import React, { useEffect, useState } from "react";

export default function AppWindow({ title, children, icon }) {
  return (
    <div className="App-window">
      <div className="App-window-head">
        <div className="App-window-icon">{icon}</div>
        <div className="App-window-title">{title}</div>
      </div>
      <div className="App-window-body">{children}</div>
    </div>
  );
}
