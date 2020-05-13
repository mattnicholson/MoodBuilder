import React, { useEffect, useState } from "react";

export default function File({ element }) {
  switch (element.extension) {
    default:
      return <img src={element.url} />;
  }
}
