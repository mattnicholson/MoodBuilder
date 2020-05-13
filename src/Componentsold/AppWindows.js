import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import FileList from "./FileList";
import PageLayers from "./PageLayers";
import ElementStates from "./ElementStates";
import ElementProperties from "./ElementProperties";
import AppWindow from "./AppWindow";
import StoreGetActivePage from "./StoreGetActivePage";
import icons from "../icons";
import StoreGetSelectedElement from "./StoreGetSelectedElement";
import StoreGetCanvasContext from "./StoreGetCanvasContext";

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];
/**
 * This layout demonstrates how to sync to localstorage.
 */
export default class LocalStorageLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      layout: JSON.parse(JSON.stringify(originalLayout))
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
  }

  resetLayout() {
    this.setState({
      layout: []
    });
  }

  onLayoutChange(layout) {
    /*eslint no-console: 0*/
    saveToLS("layout", layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout); // updates status display
  }

  render() {
    return (
      <div>
        <ReactGridLayout
          cols={12}
          rowHeight={30}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          draggableHandle={".App-window-head"}
          verticalCompact={false}
        >
          <div
            className="App-window-sizer"
            key="1"
            data-grid={{ w: 1, h: 3, x: 0, y: 0 }}
          >
            <AppWindow title={"Files"} icon={icons["files"].icon}>
              <FileList />
            </AppWindow>
          </div>
          <div
            className="App-window-sizer"
            key="3"
            data-grid={{ w: 1, h: 3, x: 0, y: 0 }}
          >
            <StoreGetCanvasContext>
              {({ element }) => (
                <AppWindow
                  title={`${element.title} Animations`}
                  icon={icons["frames"].icon}
                >
                  <ElementStates element={element} />
                </AppWindow>
              )}
            </StoreGetCanvasContext>
          </div>
          <div
            className="App-window-sizer"
            key="2"
            data-grid={{ w: 1, h: 3, x: 0, y: 0 }}
          >
            <StoreGetActivePage>
              {({ page }) => (
                <AppWindow title={`Layers`} icon={icons["layer"].icon}>
                  <PageLayers page={page} />
                </AppWindow>
              )}
            </StoreGetActivePage>
          </div>
          <div
            className="App-window-sizer"
            key="4"
            data-grid={{ w: 1, h: 3, x: 0, y: 0 }}
          >
            <StoreGetSelectedElement>
              {({ element }) => (
                <AppWindow title={`Properties`} icon={icons["properties"].icon}>
                  <ElementProperties element={element} />
                </AppWindow>
              )}
            </StoreGetSelectedElement>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-7",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
