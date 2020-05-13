import React, { useEffect, useState, useRef } from "react";
import { create } from "zustand";

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
    value: (inputs, state) => ({
      value: state.value
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
    initoff: function({ id, valuesApi }) {
      let i = 0;

      setInterval(() => {
        i++;
        let val = {};
        val[id] = { value: i };
        //valuesApi.setState(val);
      }, 1000);
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
      return { value: inputs[0].join(inputs[1][0]) };
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

let NODE_INSTANCES = {
  1: {
    type: "Text"
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
    value: "World"
  },
  3: {
    value: " - "
  }
};
let NODE_LINKS = {
  1: { from: 1, to: 4, input: 0, output: 0, order: 0 },
  2: { from: 2, to: 4, input: 0, output: 0, order: 0 },
  3: { from: 3, to: 4, input: 1, output: 0, order: 0 }
};

const [useNodes, nodesApi] = create(set => NODE_INSTANCES);
const [useValues, valuesApi] = create(set => NODE_VALUES);
const [useLinks, linksApi] = create(set => NODE_LINKS);
const [useModels, modelsApi] = create(set => NODE_MODELS);

function NodeModel({ type, id }) {
  let schema = NODE_MODELS[type];

  let obj = { ...schema, id: id };

  if (obj.initno) {
    /*obj.init({
      id,
      valuesApi
    });*/
  }
  return obj;
}

function Node({ id, children }) {
  let node = useNodes(state => state[id]);
  let values = useValues(state => state);

  let links = useLinks(state =>
    Object.values(state).filter(link => link.from == id || link.to == id)
  );

  let model = useModels(state => state[node.type]);

  //let ref = useRef(new NodeModel({ type: node.type, id: id }));

  mapPorts = function({ match, push, port }) {
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

  let value = model.value(
    inputs.map(vals => vals.map(({ id }) => values[id].value)),
    values[id]
  );

  //console.log("Node render", values["3"]);

  return children({ id: id, node: value, inputs, outputs });
}

export default function NodeGraph() {
  let nodes = useNodes(state => state);

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
      {Object.keys(nodes).map(id => (
        <Node id={id} key={id}>
          {({ id, node, inputs, outputs }) => (
            <div style={nodeStyle}>
              {inputs.map(values =>
                values.map(({ id, port }) => (
                  <div>
                    {id}:{port}
                  </div>
                ))
              )}
              <hr />
              {id}: {node.value}
              <hr />
              {outputs.map(values =>
                values.map(({ id, port }) => (
                  <div>
                    {id}:{port}
                  </div>
                ))
              )}
            </div>
          )}
        </Node>
      ))}
    </div>
  );
}

const nodeStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
  background: `rgba(0,0,0,0.1)`,
  margin: 20,
  padding: 20,
  borderRadius: `5px`
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
