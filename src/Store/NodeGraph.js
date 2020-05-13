import React, { useEffect, useState, useRef } from "react";

import { motion } from "framer-motion";
import { Rnd } from "react-rnd";

import { create } from "zustand";
import { Hidden } from "@material-ui/core";

const input = {
  id: "input",
  name: "Input"
};

const out = {
  id: "output",
  name: "Output"
};

const NODE_MODELS = {
  Text: {
    type: "Text",
    init: function({ id, api }) {
      api.setValue("Text");
    },
    value: (inputs, state) => {
      return {
        value: state.value
      };
    },
    ports: {
      input: [input],
      output: [out]
    }
  },
  MousePos: {
    type: "MousePos",
    init: function({ id, api }) {
      api.setValue(`0 x 0`);
      function mouseMove(e) {
        api.setValue(`${e.offsetX} x ${e.offsetY}`);
      }
      document.addEventListener("mousemove", mouseMove);
    },
    value: (inputs, state) => {
      return {
        value: state.value
      };
    },
    ports: {
      input: [input],
      output: [out]
    }
  },
  Process: {
    type: "Process",
    value: (inputs, state) => ({
      value: inputs[0]
    }),
    ports: {
      input: [input],
      output: [out]
    }
  },
  Counter: {
    type: "Counter",
    state: {
      value: 0
    },
    init: function({ id, api }) {
      let i = api.getValue().value;

      setInterval(() => {
        i++;
        api.setValue(i);
      }, 50);
    },
    value: (inputs, state) => {
      return {
        value: state.value
      };
    },
    ports: {
      input: [input],
      output: [out]
    }
  },
  Join: {
    type: "Join",
    value: function(inputs) {
      return { value: inputs[0].join(` ${inputs[1][0]} `) };
    },
    ports: {
      input: [
        {
          id: "array",
          name: "Array"
        },
        {
          id: "glue",
          name: "Glue"
        }
      ],
      output: [out]
    }
  }
};

let NODE_REFS = {
  root: {
    type: "Process"
  },
  1: {
    type: "MousePos"
  },
  2: {
    type: "Text"
  },
  3: {
    type: "Counter"
  },
  4: {
    type: "Join"
  }
};
let NODE_VALUES = {
  1: {
    value: "Hello"
  },
  2: {
    value: " "
  },
  3: {
    value: 99
  },
  4: {
    value: "test"
  },
  root: {
    value: null
  }
};

let NODE_LINKS = {
  root: { from: 4, to: "root", input: 0, output: 0, order: 0 },
  3: { from: 3, to: 4, input: 0, output: 0, order: 0 },
  2: { from: 2, to: 4, input: 1, output: 0, order: 0 },
  1: { from: 1, to: 4, input: 0, output: 0, order: 0 }
};

let start = Object.keys(NODE_REFS).length;
`Lorem ipsum dolor sit amet `
  .repeat(0)
  .split(" ")
  .forEach((word, ix) => {
    let id = start + 1 + ix;

    NODE_REFS[id] = {
      type: "Text"
    };
    NODE_VALUES[id] = {
      value: word
    };
    NODE_LINKS[id] = {
      from: id,
      to: 4,
      input: 0,
      output: 0,
      order: 0
    };
  });

let NODE_POSITIONS = {
  root: {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  },
  1: {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  },
  2: {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  },
  3: {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  },
  4: {
    x: 0,
    y: 0,
    w: 200,
    h: 200
  }
};

const [useNodes, nodesApi] = create(set => NODE_REFS);
const [useValues, valuesApi] = create(set => NODE_VALUES);
const [useLinks, linksApi] = create(set => NODE_LINKS);
const [useModels, modelsApi] = create(set => NODE_MODELS);

const [usePositions, positionsApi] = create(set => NODE_POSITIONS);

// Init every node
let NODE_INSTANCES = Object.keys(NODE_REFS).reduce((instances, key) => {
  let instance = new NodeModel({ id: key, type: NODE_REFS[key].type });

  instances[key] = instance;
  return instances;
}, {});

// Compute initial value for every node
Object.values(NODE_INSTANCES).forEach(model => {
  const id = model.id;
  model._init();
  model.updateValue();
});

function NodeModel({ type, id }) {
  let schema = NODE_MODELS[type];

  let model = { ...schema, id: id, hasInit: false };
  let api = {
    setValue: value => {
      let current = valuesApi.getState()[id];
      if (value != current.value) {
        let val = {};
        val[id] = { value: value };
        valuesApi.setState(val);

        // Process outputs
        let outputs = Object.values(linksApi.getState())
          .filter(link => link.from == id)
          .map(link => link.to);

        outputs.forEach(id => {
          let instance = NODE_INSTANCES[id];
          if (instance) {
            instance.updateValue();
          }
        });
      }
    },
    getValue: () => valuesApi.getState()[id]
  };

  model.setValue = api.setValue;
  model.getValue = api.getValue;
  model.getComputedValue = function() {
    let values = valuesApi.getState();
    let links = Object.values(linksApi.getState()).filter(
      link => link.from == id || link.to == id
    );

    const mapPorts = function({ match, push, port }) {
      let matches = links.filter(link => link[match] == id);

      let mapped = matches.reduce((arr, link) => {
        let copy = [...arr];

        copy[link[port]].push({ id: link[push], port: link[port] });
        return copy;
      }, model.ports[port].map(() => []));

      return mapped;
    };

    let inputs = mapPorts({ match: "to", push: "from", port: "input" });
    let outputs = mapPorts({ match: "from", push: "to", port: "output" });

    let computedValue = model.value(
      inputs.map(vals => vals.map(({ id }) => values[id].value)),
      values[id]
    );

    return computedValue;
  };
  model.updateValue = function() {
    let computedValue = model.getComputedValue();
    model.setValue(computedValue.value);
  };
  model._init = () => {
    if (model.init) {
      model.init({
        id,
        api: api
      });
    }
    model.hasInit = true;
    // _init return a function that can be called as shutdown function
    return () => {
      if (model.destroy) {
        model.destroy({
          id,
          api: api
        });
      }
    };
  };
  return model;
}

function Node({ id, children }) {
  let node = useNodes(state => state[id]);
  let values = useValues(state => state);

  let links = useLinks(state =>
    Object.values(state).filter(link => link.from == id || link.to == id)
  );

  let model = useModels(state => state[node.type]);
  let inputs = model.ports.input;
  let outputs = model.ports.output;
  /*let ref = useRef(new NodeModel({ type: node.type, id: id }));

  useEffect(() => {
    let instance = ref.current;
    if (!instance.hasInit) {
      instance._init();
    }
  });*/

  let value = values[id];

  return children({ id: id, node: model, value: value.value, inputs, outputs });
}

export default function NodeGraph() {
  let nodes = useNodes(state => state);
  let links = useLinks(state => state);
  let positions = usePositions(state => state);

  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          let num = Object.keys(nodes).length;

          // Make an ID
          let id = `${num + 1}`;

          // Make a new node
          let add = {};
          add[id] = { type: "Text" };

          // Make a new value
          let val = {};
          val[id] = { value: Math.random() };

          // Add the node and the value
          nodesApi.setState(add);
          valuesApi.setState(val);
        }}
      >
        Update
      </div>
      <div style={canvasWrapperStyle}>
        <div style={canvasStyle}>
          <svg style={svgStyle}>
            {Object.values(links).map((link, ix) => {
              let from = positions[link.from] || { x: 0, y: 0 };
              let to = positions[link.to] || { x: 0, y: 0 };

              let curve = {
                x: 0,
                y: (to.y - from.y) * 0.5
              };
              return (
                <path
                  key={ix}
                  d={`M ${from.x},${from.y} C${from.x - curve.x},${from.y +
                    curve.y} ${to.x + curve.x},${to.y - curve.y} ${to.x},${
                    to.y
                  }`}
                  style={pathStyle}
                />
              );
            })}
          </svg>
          {Object.keys(nodes)
            //.filter(id => nodes[id].type == "Process")
            .map(id => (
              <Node id={id} key={id}>
                {({ id, node, value, inputs, outputs }) => (
                  <Rnd
                    style={nodeStyle}
                    onDrag={(e, args) => {
                      let cur = positions[id];
                      if (!cur) {
                        cur = {
                          x: 0,
                          y: 0
                        };
                      }
                      let val = {};
                      val[id] = {
                        ...cur,
                        x: cur.x + args.deltaX,
                        y: cur.y + args.deltaY
                      };
                      positionsApi.setState(val);
                    }}
                  >
                    <div>
                      {/*inputs.map(values =>
                values.map(({ id, port }, ix) => (
                  <div key={ix}>
                    {id}:{port}
                  </div>
                ))
                )*/}
                      {node.type}
                      <hr />
                      {id}: {value}
                      <hr />
                      {/*outputs.map(values =>
                values.map(({ id, port }, ix) => (
                  <div key={ix}>
                    {id}:{port}
                  </div>
                ))
                )*/}
                    </div>
                  </Rnd>
                )}
              </Node>
            ))}
        </div>
      </div>
    </div>
  );
}

const canvasWrapperStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
  background: `rgba(0,0,0,0.1)`,
  display: "block",
  width: `auto`,
  height: `80vh`,
  margin: `20px 0`,
  padding: 0,
  borderRadius: `5px`,
  position: "relative",
  overflow: "hidden"
};

const canvasStyle = {
  //border: "1px solid rgba(255,255,255,0.2)",
  //background: `rgba(255,0,0,0.1)`,
  display: "block",
  width: `100%`,
  height: `100%`,
  padding: 0,
  position: "absolute",
  top: 0,
  left: 0,
  overflow: "visible"
};

const svgStyle = {
  //background: `rgba(0,0,255,0.1)`,
  display: "block",
  width: `100%`,
  height: `100%`,
  padding: 0,
  position: "absolute",
  top: 0,
  left: 0
};

const pathStyle = {
  fill: "transparent",
  stroke: `orange`,
  strokeWidth: `5px`
};

const nodeStyle = {
  boxShadow: "0 0 2px rgba(0,0,0,0.8)",
  background: `#232323`,
  display: "block",
  width: 200,
  height: 200,
  margin: 20,
  padding: 20,
  borderRadius: `5px`,
  position: "absolute",
  top: 0,
  left: 0
};

/*
export default function Graph({ elements }) {
  const input = {
    id: "input",
    name: "Input"
  };

  const out = {
    id: "output",
    name: "Output"
  };

  const nodes = {
    1: {
      type: "Text",
      id: 1,
      value: () => "Hello",
      ports: {
        input: [input],
        output: [out]
      }
    },
    2: {
      type: "Text",
      id: 2,
      value: () => "World",
      ports: {
        input: [input],
        output: [out]
      }
    },
    3: {
      type: "Counter",
      id: 3,
      state: {
        value: 0
      },
      init: function() {
        let i = 0;
        setInterval(() => {
          i++;
          this.setState({
            value: i
          });
        }, 1000);
      },
      value: function() {
        return ` ${this.state.value} `;
      },
      ports: {
        input: [input],
        output: [out]
      }
    },
    4: {
      type: "Join",
      id: 4,
      value: function() {
        let inputs = this.inputs();
        return inputs[0]
          .map(node => node.value())
          .join(inputs[1][0].value());
      },
      ports: {
        input: [
          {
            id: "strings",
            name: "Strings"
          },
          {
            id: "glue",
            name: "Glue"
          }
        ],
        output: [out]
      }
    }
  };

  const links = {
    1: { from: 1, to: 4, port: 0, order: 0 },
    2: { from: 2, to: 4, port: 0, order: 0 },
    3: { from: 3, to: 4, port: 1, order: 0 }
  };

  function Node({ node }) {
    let inputs = () =>
      Object.keys(links)
        .map(k => ({ ...links[k], id: k }))
        .filter(link => link.to == node.id)
        .reduce((arr, link) => {
          let copy = [...arr];
          copy[link.port].push(new Node({ node: nodes[link.from] }));
          return copy;
        }, node.ports.input.map(input => []));

    let outputs = () =>
      Object.keys(links)
        .map(k => ({ ...links[k], id: k }))
        .filter(link => link.to == node.id)
        .reduce((arr, link) => {
          let copy = [...arr];
          copy[link.port].push(new Node({ node: nodes[link.to] }));
          return copy;
        }, node.ports.input.map(input => []));

        let setState = function(){
          console.log(this);
        }

    return { ...node, inputs, outputs,setState };
  }

  let Nodes = Object.values(nodes).map(node => {
    let n = new Node({ node });

  });

  Nodes.forEach(Node => {
    console.log(Node.value());
  });
  // Return the rendered root element
  return (
    <div>
      {Nodes.map(node => (
        <div style={nodeStyle}>{node.value()}</div>
      ))}
    </div>
  );
}
*/
