import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "./Select";

import GetElements from "../Get";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function AppSelect({
  name,
  value,
  onChange,
  options,
  id = "lookup-input"
}) {
  const classes = useStyles();
  const [val, setVal] = React.useState(value);

  const handleChange = event => {
    setVal(event.target.value);
    if (onChange) onChange(event);
  };
  return (
    <GetElements>
      {({ elements }) => (
        <Select
          name={name}
          value={val}
          onChange={handleChange}
          options={elements.map(e => ({ value: e.id, label: e.title }))}
        />
      )}
    </GetElements>
  );
}
