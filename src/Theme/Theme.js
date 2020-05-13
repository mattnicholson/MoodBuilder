import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Grid
} from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";

import { useThemeStore } from "./theme";
import userTheme from "./theme";

export default function Theme() {
  let themeSettings = useThemeStore();

  let theme = userTheme(themeSettings);
  return (
    <ThemeProvider theme={theme.mui}>
      <Paper elevation={0} style={{ background: theme.settings.palette(0) }}>
        {/* Page Padding */}

        <motion.div
          animate
          style={theme.settings.designer.getStyle("page", { theme })}
        >
          {/* Page Border */}
          <motion.div
            animate
            style={theme.settings.designer.getStyle("frame", { theme })}
          >
            <Box p={1}>
              <Typography variant={"h1"} component={"p"}>
                {theme.settings.designer.name}
              </Typography>
            </Box>

            <motion.img
              animate
              style={theme.settings.designer.getStyle("heroImage", { theme })}
              src={theme.settings.designer.getImage()}
            />
          </motion.div>
          {/* End Page Border */}
        </motion.div>
        {/* End Page Padding */}

        <Grid container spacing={0}>
          {[0, 0.25, 0.5, 1].map((amt, ix) => (
            <Grid item xs={1} key={ix}>
              <Box
                p={2}
                style={{
                  background: theme.settings.palette(amt)
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0}>
          {[0, 0.25, 0.5, 1].map((amt, ix) => (
            <Grid item xs={1} key={ix}>
              <Box
                p={2}
                style={{
                  background: theme.settings.scheme(amt)
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}
