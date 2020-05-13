import React, { useState } from "react";

// App inputs
import Select from "./Inputs/Select";
import Text from "./Inputs/Text";
import Color from "./Inputs/Color";
import Slider from "./Inputs/Slider";
import Element from "./Inputs/Element";

import AddButton from "./Inputs/AddButton";

import schemas from "./schemas.js";

import { api } from "./store";
import { Typography } from "@material-ui/core";

function ElementField(props) {
  onChange = e => {
    props.onChange(props.name, e.target.value);
  };

  let defaultValue = props.hasOwnProperty("default") ? props.default : "";
  let value = typeof props.value == "undefined" ? defaultValue : props.value;

  switch (props.type) {
    case "slider":
      return (
        <Slider
          name={props.label}
          value={value}
          range={props.range}
          step={props.step}
          onChange={onChange}
        />
      );
    case "element":
      return <Element name={props.label} value={value} onChange={onChange} />;
    case "relationship":
      return (
        <Select
          name={props.label}
          value={value}
          options={[]}
          onChange={onChange}
        />
      );
    case "color":
      return <Color name={props.label} value={value} onChange={onChange} />;
    case "select":
      return (
        <Select
          name={props.label}
          value={value}
          options={props.options}
          onChange={onChange}
        />
      );
    case "text":
      return <Text name={props.label} value={value} onChange={onChange} />;
    default:
      return <Text name={props.label} value={value} onChange={onChange} />;
  }
}

function ElementForm({ draft, onChange }) {
  return Object.keys(schemas[draft.type]).map((field, ix) => (
    <ElementField
      key={`field_${ix}_${field}`}
      name={field}
      {...schemas[draft.type][field]}
      value={draft[field]}
      onChange={onChange}
    />
  ));
}

export default function Create({ init = { type: "Element" } }) {
  const [draft, setDraft] = React.useState(init);

  const handleChange = (key, val) => {
    let copy = { ...draft };
    copy[key] = val;
    setDraft(copy);
  };

  return (
    <div>
      <ElementForm draft={draft} onChange={handleChange} />
      <AddButton
        onClick={() => {
          api.dispatch({ type: "CREATE_ELEMENT", data: draft });
        }}
      />
    </div>
  );
}
