import React from "react";
import RenderPage from "./RenderPage";
import Canvas from "./Canvas";
import { Hidden } from "@material-ui/core";

export default function EditPage({ page, state }) {
  return <Canvas page={page} state={state} />;
}
