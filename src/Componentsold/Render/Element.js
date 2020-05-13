import React, { useEffect, useState } from "react";
import Container from "./Container";
import File from "./File";

export default function Element({ element }) {
  switch (element.type) {
    case "Container":
      return <Container element={element} />;
    case "File":
      return <File element={element} />;
    default:
      return <div />;
  }
}
