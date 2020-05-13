import { createMuiTheme, makeStyles } from "@material-ui/core/styles";

// Chroma
// https://gka.github.io/chroma.js

import chroma from "chroma-js";
import ColorScheme from "./ColorScheme";

// ColorScheme
// http://c0bra.github.io/color-scheme-js/#tryit

import create from "zustand";
// Default theme: https://material-ui.com/customization/default-theme/
// Theme builder example: https://material-theme-builder.glitch.me/

import audreyInterior01 from "./designers/audrey/interior/01.jpg";
import isaacInterior01 from "./designers/isaac/interior/01.jpg";

const defaultSettings = {
  designer: "audrey",
  complexity: 0.5,
  warmth: 0.5,
  baseColor: "#000000"
};

let autosaved = JSON.parse(window.localStorage.getItem("themeState"));

const userSettings = autosaved ? autosaved : defaultSettings;

const [useThemeStore, themeApi] = create(set => userSettings);

const unsub = themeApi.subscribe(state => {
  window.localStorage.setItem("themeState", JSON.stringify(state));
});

const designers = {
  audrey: {
    name: "Audrey",
    getImage: num => {
      return audreyInterior01;
    },
    getStyle: (type, { theme }) => {
      switch (type) {
        case "h1":
          return {
            fontSize: `5vw`,
            fontWeight: "normal",
            letterSpacing: `-0.08em`,
            paddingBottom: `0`
          };
        case "page":
          return {
            background: theme.settings.palette(theme.settings.warmth)
          };
        case "heroImage":
          return {
            display: `block`,
            width: `50%`,
            marginLeft: `auto`
          };
        case "frame":
          return {
            textAlign: "left"
          };
        default:
          return { background: "transparent" };
      }
    },
    palette: {
      count: 3,
      mode: "rgb",
      start: ({ color, warmth }) => {
        return chroma("#FFFFFF").darken(warmth);
      },
      end: ({ color }) => {
        return chroma(color)
          .saturate(2)
          .hex();
      },
      scheme: ({ color, complexity }) => {
        let scheme = new ColorScheme();
        scheme
          .from_hex(color.replace("#", ""))
          .scheme("analogic")
          .distance(complexity)
          .add_complement(complexity > 0.5)
          .variation("hard");

        return chroma.scale(scheme.colors());
      },
      classes: [0, 0.3, 0.55, 0.85, 1]
    },
    radius: 0,
    description: "Loves minimal grids, and swiss design with bold statements.",
    fonts: [
      {
        stack: `'Nimbus Sans L',sans-serif`,
        complexity: 0,
        warmth: 0
      },
      {
        stack: `'Bagnard',serif`,
        complexity: 1,
        warmth: 1
      }
    ]
  },
  isaac: {
    name: "Isaac",
    getImage: num => {
      return isaacInterior01;
    },
    getStyle: (type, { theme }) => {
      switch (type) {
        case "h1":
          return {
            fontSize: `10vw`,
            fontWeight: "normal",
            letterSpacing: `-0.05em`,
            paddingBottom: `0`,
            position: `absolute`,
            top: `50%`,
            left: 0,
            width: `100%`,
            lineHeight: 0.7,
            zIndex: 2,
            transform: `translate3d(0,-50%,0)`,
            textShadow: `0 0 10px rgba(0,0,0,0.2)`
          };
        case "page":
          return {
            position: `relative`,
            background: `linear-gradient(${theme.settings
              .palette(1)
              .hex()}, ${theme.settings.palette(0).hex()})`,
            padding: `${1 + theme.settings.complexity * 5}vw`
          };
        case "heroImage":
          return {
            display: `block`,
            width: `50%`,
            margin: `0 auto`,
            borderRadius: `${theme.settings.warmth * 10}px`,
            boxShadow: `${theme.settings.complexity * 10}px ${theme.settings
              .complexity * 10}px 0px rgba(255,255,255,0.5)`
          };
        case "frame":
          return {
            position: `relative`,
            borderRadius: `${theme.settings.warmth * 10}px`,
            textAlign: `center`,
            padding: `${1 + theme.settings.complexity * 5}vw`,
            border: `${theme.settings.complexity *
              4}px solid rgba(255,255,255,0.5)`
          };
        default:
          return { background: "transparent" };
      }
    },
    palette: {
      count: 3,
      mode: "lch",
      start: ({ color, warmth, complexity }) => {
        return chroma(color)
          .desaturate(1)
          .brighten(0.5 - (1 - warmth))
          .luminance(0.8)
          .hex();
      },
      end: ({ color, warmth, complexity }) => {
        return chroma(color)
          .luminance(0.6)
          .desaturate(1 - complexity)
          .hex();
      },
      scheme: ({ color, complexity }) => {
        let scheme = new ColorScheme();
        scheme
          .from_hex(color.replace("#", ""))
          .scheme("analogic")
          .distance(complexity)
          .add_complement(complexity > 0.5)
          .variation("light");

        return chroma.scale(scheme.colors());
      },
      classes: [0, 0.3, 0.55, 0.85, 1]
    },
    spacing: {
      horizontal: 20,
      vertical: 20
    },
    radius: 1,
    description: "Light and airy, with a sense of fun and approachability.",
    fonts: [
      {
        stack: `'Bagnard',serif`,
        complexity: 1,
        warmth: 1
      }
    ]
  }
};

function graphPos(x, y) {
  return x * x + y * y;
}

function posDiff(posA, posB) {
  return Math.abs(posA - posB);
}

function getDesignerPalette(color, { designer, warmth, complexity }) {
  let palette = chroma
    .scale([
      designer.palette.start({ color, warmth, complexity }),
      designer.palette.end({ color, warmth, complexity })
    ])
    .mode(designer.palette.mode)
    .classes(designer.palette.classes);

  return palette;
}

function getDesignerScheme(color, { designer, warmth, complexity }) {
  let scheme = designer.palette.scheme({ color, warmth, complexity });

  return scheme;
}

function chooseTypeStack({ designer, warmth, complexity }) {
  let userPos = graphPos(complexity, warmth);
  let diff = 0;
  let chooseIx = -1;
  designer.fonts.forEach((font, ix) => {
    let p = posDiff(userPos, graphPos(font.warmth, font.complexity));
    if (p < diff || chooseIx == -1) {
      diff = p;
      chooseIx = ix;
    }
  });

  return designer.fonts[chooseIx].stack;
}

function getDesignerRadius({ designer, warmth, complexity }) {
  return warmth * complexity * designer.radius * 20;
}

function loadThemeFromSettings(themeSettings, callback) {
  let designer = { ...designers[themeSettings.designer] };

  return callback({ ...themeSettings, designer: designer });
}

const userTheme = themeSettings => {
  return loadThemeFromSettings(
    themeSettings,
    ({ baseColor, designer, warmth, complexity }) => {
      let palette = getDesignerPalette(baseColor, {
        designer,
        warmth,
        complexity
      });

      let scheme = getDesignerScheme(baseColor, {
        designer,
        warmth,
        complexity
      });

      return {
        settings: {
          palette: palette,
          scheme: scheme,
          designer: designer,
          warmth,
          complexity
        },
        mui: createMuiTheme({
          palette: {
            primary: {
              //light: "#FFAF7A",
              main: palette(1).hex()
              //dark: "#FF6600"
            },
            text: {
              //light: "#FFAF7A",
              primary: scheme(0)
                .luminance(warmth)
                .hex()
              //dark: "#FF6600"
            }
          },
          shape: {
            borderRadius: getDesignerRadius({ designer, warmth, complexity })
          },
          typography: {
            fontFamily: chooseTypeStack({ designer, warmth, complexity }),
            fontSize: 16,
            textAlign: "center",
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
            h1: designer.getStyle("h1", { theme: null })
          }
        })
      };
    }
  );
};

export default userTheme;
export { designers, useThemeStore, themeApi };
