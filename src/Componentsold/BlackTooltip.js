import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";

const useStylesTooltip = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black
  },
  tooltip: {
    backgroundColor: theme.palette.common.black
  }
}));

export default function BlackTooltip(props) {
  const classes = useStylesTooltip();

  return <Tooltip arrow classes={classes} {...props} />;
}
