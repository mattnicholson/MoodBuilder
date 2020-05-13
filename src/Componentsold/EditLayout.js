import React from "react";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import EditableElement from "./Edit/Element.js";
import StoreGetSettings from "./StoreGetSettings.js";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import useStore from "../store.js";
import action from "../actions";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

//const ResponsiveGridLayout = WidthProvider(Responsive);
const ResponsiveGridLayout = WidthProvider(GridLayout);

function getLayouts() {
  let layout = [
    { i: "1", x: 0, y: 0, w: 1, h: 2, static: true },
    //{ i: "2", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "2", x: 4, y: 0, w: 1, h: 2 },
    { i: "3", x: 4, y: 0, w: 1, h: 2 }
  ];

  return {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout
  };
}

export default function EditLayout({ page }) {
  // {lg: layout1, md: layout2, ...}
  //var layouts = getLayouts();

  const elements = useStore(state =>
    state.getElements({ id: page.children, type: ["Container", "Layout Item"] })
  );

  let layout = elements.map(e => {
    return { i: `${e.id}`, x: 0, y: 0, w: 1, h: 2 };
  });

  let layouts = page.hasOwnProperty("layoutJSON")
    ? JSON.parse(page.layoutJSON)
    : {
        lg: layout,
        md: layout,
        sm: layout
      };

  const itemCallback = (
    layout,
    oldItem,
    newItem,
    placeholder,
    mouseEvent,
    element
  ) => {
    let { w, h, x, y } = newItem;
    action("UPDATE_ELEMENT", { id: newItem.i, data: { size: { w, h, x, y } } });
  };

  return (
    <StoreGetSettings>
      {({ settings }) => (
        <React.Fragment>
          <ResponsiveGridLayout
            className="layout"
            layoutsoff={layouts}
            breakpoints={{ lg: 1024, md: 768, sm: 0 }}
            colsoff={{ lg: 18, md: 18, sm: 18 }}
            cols={settings.cols}
            rowHeight={1}
            preventCollision={false}
            margin={[settings.margin[0], 5]}
            containerPadding={settings.containerPadding}
            onLayoutChangeoff={(layout, layouts) =>
              action("SAVE_LAYOUT", { element: page, layout: layouts })
            }
            onLayoutChange={(layout, layouts) => {
              //console.log(layout, layouts);
              //action("SAVE_LAYOUT", { element: page, layout: layouts })
            }}
            onResizeStop={itemCallback}
            onDragStop={itemCallback}
          >
            {elements
              .filter(e => !e.hidden)
              .map(e => (
                <div
                  key={e.id}
                  data-grid={{ x: 0, y: 0, w: 18, h: 10, ...e.size }}
                >
                  <EditableElement element={e} />
                </div>
              ))}
          </ResponsiveGridLayout>
          <Typography align={"center"}>
            <div
              onClick={() => action("ADD_BLANK_TO_LAYOUT", { parent: page })}
            >
              <IconButton aria-label="add" color="primary">
                <AddIcon />
              </IconButton>
            </div>
          </Typography>
        </React.Fragment>
      )}
    </StoreGetSettings>
  );
}
