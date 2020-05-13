import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
  id = "select-input"
}) {
  const classes = useStyles();
  const [val, setVal] = React.useState(value);

  const handleChange = event => {
    setVal(event.target.value);
    if (onChange) onChange(event);
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${id}-${name}-label`}>{name}</InputLabel>
      <Select
        labelId={`${id}-${name}-label`}
        id={`${id}-${name}`}
        value={val}
        onChange={handleChange}
      >
        {options.map((o, ix) => (
          <MenuItem key={`${id}-${name}-${ix}`} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
