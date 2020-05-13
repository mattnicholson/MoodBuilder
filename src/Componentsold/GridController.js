import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import AccountCircle from "@material-ui/icons/AccountCircle";

import StoreGetSettings from "./StoreGetSettings";
import action from "../actions";
import icons from "../icons";

const useStyles = makeStyles({
  root: {
    width: 300,
    color: "white",
    margin: "auto"
  }
});

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider() {
  const classes = useStyles();

  return (
    <StoreGetSettings>
      {({ settings }) => (
        <Box pb={2}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField
                id="grid-columns"
                label="Columns"
                size="small"
                value={settings.cols}
                onChange={(e, value) => {
                  let v = e.target.value ? parseInt(e.target.value) : "";
                  action("UPDATE_GRID_COLS", {
                    value: v
                  });
                }}
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {icons["columns"].icon}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="grid-gutters"
                label="Gutters"
                size="small"
                value={settings.margin[0]}
                onChange={(e, value) => {
                  let v = e.target.value ? parseInt(e.target.value) : "";
                  action("UPDATE_GRID_MARGINS", {
                    value: [v, settings.margin[1]]
                  });
                }}
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {icons["gutter"].icon}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <span
                      style={{
                        display: "inline-block",
                        paddingTop: 16,
                        verticalAlign: "bottom"
                      }}
                    >
                      px
                    </span>
                  )
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="grid-topSpacing"
                label="Inset Top"
                size="small"
                value={settings.containerPadding[1]}
                onChange={(e, value) => {
                  let v = e.target.value ? parseInt(e.target.value) : "";
                  action("UPDATE_GRID_PADDING", {
                    value: [settings.containerPadding[0], v]
                  });
                }}
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {icons["spacingTop"].icon}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <span
                      style={{
                        display: "inline-block",
                        paddingTop: 16,
                        verticalAlign: "bottom"
                      }}
                    >
                      px
                    </span>
                  )
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="grid-topSpacing"
                label="Inset Edges"
                size="small"
                value={settings.containerPadding[0]}
                onChange={(e, value) => {
                  let v = e.target.value ? parseInt(e.target.value) : "";
                  action("UPDATE_GRID_PADDING", {
                    value: [v, settings.containerPadding[1]]
                  });
                }}
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {icons["spacingEdge"].icon}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <span
                      style={{
                        display: "inline-block",
                        paddingTop: 16,
                        verticalAlign: "bottom"
                      }}
                    >
                      px
                    </span>
                  )
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </StoreGetSettings>
  );
}
