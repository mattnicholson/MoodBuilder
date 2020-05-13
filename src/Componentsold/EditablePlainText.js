import React, { useState, useMemo } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

const EditablePlainText = ({ text, onChange }) => {
  const [value, setValue] = useState([{ children: [{ text }] }]);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);
        if (onChange) {
          onChange(value[0].children[0].text);
        }
      }}
    >
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  );
};

const initialValue = [
  {
    children: [{ text: "This is editable plain text, just like a <textarea>!" }]
  }
];

export default EditablePlainText;
