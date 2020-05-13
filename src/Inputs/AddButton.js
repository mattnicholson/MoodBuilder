import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

export default function AddButton({ onClick = null }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="add" onClick={onClick}>
        <AddIcon />
      </IconButton>
    </div>
  );
}
