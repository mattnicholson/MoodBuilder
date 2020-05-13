import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

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
  range = [0, 100],
  step = 1,
  id = "slider-input"
}) {
  const classes = useStyles();
  const [val, setVal] = React.useState(parseFloat(value));

  const handleChange = (e, value) => {
    if (value === val) return;
    setVal(value);
    if (onChange) onChange({ target: { value: value } });
  };
  return (
    <FormControl className={classes.formControl}>
      <Typography gutterBottom variant="caption">
        {name}
      </Typography>
      <Slider
        label={name}
        id={`${id}-${name}`}
        value={val}
        onChange={handleChange}
        min={range[0]}
        max={range[1]}
        step={step}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}
