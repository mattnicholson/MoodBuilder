import React from "react";
import { render } from "react-dom";
import { Rnd } from "react-rnd";

import "../Styles/DraggableBox.scss";

class DraggableBox extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 200,
      height: 200,
      x: 200,
      y: 200,
      changed: 0
    };
  }

  render() {
    let x,
      y,
      width,
      height = 200;

    if (this.props.hasOwnProperty("x")) x = this.props.x;
    if (this.props.hasOwnProperty("y")) y = this.props.y;
    if (this.props.hasOwnProperty("width") && this.props.width)
      width = Math.max(parseInt(this.props.width), 50);
    if (this.props.hasOwnProperty("height") && this.props.height)
      height = Math.max(parseInt(this.props.height), 50);

    if (typeof width == "undefined" || width === NaN) width = 200;
    if (typeof height == "undefined" || height === NaN) height = 200;

    width = parseInt(width);
    height = parseInt(height);

    if (!x && !(x === 0)) x = 0;
    if (!y && !(y === 0)) y = 0;

    let coords = { x, y, width, height };
    let className = this.props.className || "DraggableBox";
    let passProps = { ...this.props };
    delete passProps.children;

    let disabled = !!this.props.disabled;

    return (
      <Rnd
        resizeHandleClasses={{
          bottom: `${className}-resize ${className}-resize--bottom`,
          bottomLeft: `${className}-resize ${className}-resize--bottomLeft`,
          bottomRight: `${className}-resize ${className}-resize--bottomRight`,
          left: `${className}-resize ${className}-resize--left`,
          right: `${className}-resize ${className}-resize--right`,
          top: `${className}-resize ${className}-resize--top`,
          topLeft: `${className}-resize ${className}-resize--topLeft`,
          topRight: `${className}-resize ${className}-resize--topRight`
        }}
        {...passProps}
        enableResizing={{
          bottom: !disabled,
          bottomLeft: !disabled,
          bottomRight: !disabled,
          left: !disabled,
          right: !disabled,
          top: !disabled,
          topLeft: !disabled,
          topRight: !disabled
        }}
        disableDragging={disabled}
        className={className}
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => {
          //this.setState({ x: d.x, y: d.y, changed: 1 });
          if (this.props.onDragStop) {
            this.props.onDragStop({ x: d.x, y: d.y });
          }
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          /*this.setState({
            width: ref.style.width,
            height: ref.style.height,
            changed: 1,
            ...position
          });*/
          if (this.props.onResizeStop) {
            this.props.onResizeStop({
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position
            });
          }
        }}
      >
        <div className={`${className}-content`} style={null}>
          {this.props.children}
        </div>
      </Rnd>
    );
  }
}
export default DraggableBox;
