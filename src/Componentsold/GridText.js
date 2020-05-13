import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";

// Default theme: https://material-ui.com/customization/default-theme/
// Theme builder example: https://material-theme-builder.glitch.me/
const drawerWidth = 240;
const defaultTheme = createMuiTheme({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  palette: {
    primary: {
      main: "#222"
    }
  },

  typography: {
    fontFamily: "system-ui",
    fontSize: 14,
    h6: {
      fontSize: `0.8rem`,
      letterSpacing: "0.04em",
      fontWeight: "normal"
    },
    h5: {
      fontSize: `1rem`
    },
    h4: {
      fontSize: `1rem`
    },
    h3: {
      fontSize: `1rem`
    },
    h2: {
      fontSize: `1rem`
    },
    h1: {
      fontSize: `1rem`,
      fontWeight: "normal",
      letterSpacing: "0.04em",
      paddingBottom: `1em`
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "#222222",
    color: "#FFF"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#EEEEEE",
    padding: "20px",
    color: "#222",
    paddingTop: "70px"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  }
}));

export default function RenderPage({ page }) {
  const [spacing, setSpacing] = useState(12);
  const [color, setColor] = useState("#eeeeee");
  const [headingSize, setHeadingSize] = useState(12);

  const classes = useStyles();

  let theme = createMuiTheme({
    spacing: spacing,
    palette: {
      primary: {
        main: color
      },
      divider: "rgba(0,0,0,1)"
    },

    typography: {
      fontFamily: `'Helvetica','Arial',sans-serif`,
      h1: {
        fontFamily: `'Helvetica','Arial',sans-serif`,
        fontSize: `${headingSize}rem`,
        fontWeight: `300`,
        lineHeight: `120%`,
        letterSpacing: 0
      }
    }
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            >
              <Divider />
              <Typography variant="h1" color="inherit">
                <span contenteditable="true">{page.title}</span>
              </Typography>

              <Typography variant="body1" color="inherit">
                <span contenteditable="true">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </span>
              </Typography>
              <Divider />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={6}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={6}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={6}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
          <Grid item xs={true} md={3}>
            <Paper
              square={true}
              elevation={0}
              style={{ padding: theme.spacing(3) }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </React.Fragment>
  );
}
