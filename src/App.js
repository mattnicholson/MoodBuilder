import React, { useState } from "react";
import { Box, Paper, Typography, Divider } from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";

// Inputs for editing
import Slider from "./Inputs/Slider";
import Select from "./Inputs/Select";
import Color from "./Inputs/Color";

import UserTheme from "./Theme/Theme";
import { useThemeStore, themeApi, designers } from "./Theme/theme";

import appTheme from "./theme";

import "./Styles/App.scss";

export default function App() {
  const theme = useThemeStore(state => state);

  return (
    <>
      <ThemeProvider theme={appTheme}>
        <Box mb={1}>
          <UserTheme />
        </Box>
        <div
          style={{
            opacity: 0.9,
            position: "fixed",
            bottom: 10,
            left: 10,
            right: 10
          }}
        >
          <Paper elevation={0}>
            <Box p={1}>
              <Select
                name="Designer"
                value={theme.designer}
                options={Object.keys(designers).map(key => ({
                  value: key,
                  label: designers[key].name
                }))}
                onChange={e => {
                  themeApi.setState({ designer: e.target.value });
                }}
              />
              <Slider
                name={"Complexity"}
                step={0.1}
                value={theme.complexity}
                range={[0, 1]}
                onChange={e => {
                  themeApi.setState({ complexity: e.target.value });
                }}
              />
              <Slider
                name={"Warmth"}
                step={0.1}
                value={theme.warmth}
                range={[0, 1]}
                onChange={e => {
                  themeApi.setState({ warmth: e.target.value });
                }}
              />
              <Color
                name={"Color"}
                step={0.1}
                value={theme.baseColor}
                onChange={e => {
                  themeApi.setState({ baseColor: e.target.value });
                }}
              />
            </Box>
          </Paper>
        </div>
      </ThemeProvider>
    </>
  );
}
