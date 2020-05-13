import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  text: {
    width: 100
  },
  color: {
    width: `50px`,
    height: `50px`,
    padding: 0,
    border: "none",
    "&::before,&::after": {
      display: "none"
    },
    "& > *": {
      display: "block",
      padding: 0,
      height: "100%;",
      margin: 0,
      border: "none"
    }
  }
}));

export default function AppSelect({
  name,
  value,
  onChange,
  options,
  id = "color-input"
}) {
  const classes = useStyles();
  const [val, setVal] = React.useState(value);

  const handleChange = event => {
    setVal(event.target.value);
    if (onChange) onChange(event);
  };
  return (
    <FormControl className={classes.formControl}>
      <Grid container spacing={1}>
        <Grid item>
          <Input
            className={classes.color}
            type="color"
            label={name}
            id={`${id}-${name}`}
            value={val}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            InputLabelProps={{ shrink: true }}
            className={classes.text}
            label={name}
            id={`${id}-${name}`}
            value={val}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
}
