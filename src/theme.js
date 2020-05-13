import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

// Default theme: https://material-ui.com/customization/default-theme/
// Theme builder example: https://material-theme-builder.glitch.me/

const appTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#FFAF7A",
      main: "#FF8b3d",
      dark: "#FF6600"
    }
  },

  typography: {
    fontFamily: `'Source Code Pro', monospace`,
    fontSize: 11,
    h6: {
      fontSize: `1rem`,
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

export default appTheme;
