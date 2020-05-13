const SCHEMAS = [
  "Root",
  "Element",
  "File",
  "Composition",
  "Box",
  "Relationship",
  "Property"
];
const RELATIONSHIPS = ["Child", "Property"];

// Element attributes - all elements should have these
const elementSchema = {
  title: {
    label: "Title",
    type: "text"
  },
  type: {
    label: "Type",
    type: "select",
    options: SCHEMAS.map(s => ({ value: s, label: s }))
  }
  /*links: {
    label: "Links",
    type: "relationship",
    schemas: ["Relationship"]
  }*/
};

// ELements handling relationships need this information
const relationshipSchema = {
  from: {
    label: "From",
    type: "element"
  },
  to: {
    label: "To",
    type: "element"
  },
  via: {
    label: "Via",
    type: "element"
  },
  position: {
    label: "Position",
    type: "text"
  },
  relationshipType: {
    label: "Relationship Type",
    type: "select",
    options: RELATIONSHIPS.map(s => ({ value: s, label: s })),
    default: 0
  }
};

// File information
const fileSchema = {
  url: {
    label: "URL",
    type: "text"
  },
  filename: {
    label: "Filename",
    type: "text"
  },
  extension: {
    label: "Extension",
    type: "text"
  }
};

// Properties that can be transitioned with Framer motion
const transitionProps = {
  opacity: {
    label: "Opacity",
    type: "slider",
    range: [0, 1],
    step: 0.05,
    default: 1
  },
  backgroundColor: {
    label: "Background",
    type: "color",
    default: "transparent"
  }
};

// Properties that define an animation timeline duration/behaviour
const animationSchema = {
  duration: {
    label: "Duration",
    type: "text",
    default: 1
  },
  repeat: {
    label: "Repeat",
    type: "select",
    options: [
      { value: 0, label: "None" },
      { value: "yoyo", label: "YoYo" },
      { value: "loop", label: "Loop" }
    ],
    default: 0
  },
  ease: {
    label: "Ease",
    type: "select",
    options: [
      { value: "linear", label: "None" },
      { value: "easeInOut", label: "Ease In/Out" },
      { value: "easeOut", label: "Ease Out" },
      { value: "easeInOutQuint", label: "Ease In/Out Quint" },
      { value: "easeOutExpo", label: "Ease Out Expo" }
    ],
    default: "easeInOut"
  }
};

// Reduce the main array down so all elements have the base element properties
const schemas = SCHEMAS.reduce((schemas, type) => {
  schemas[type] = { ...elementSchema };
  return schemas;
}, {});

// Additional schema compositions...
schemas["Root"] = {
  transformer: ({ element, root, context, level }) => {
    return {
      isRoot: true
    };
  }
};

// Add file props to File types
schemas["File"] = { ...schemas["File"], ...fileSchema };

// Compositions need an animation schema
schemas["Composition"] = { ...schemas["Composition"], ...animationSchema };

// Boxes need to do what a Composition can do, but can also set transition props
schemas["Box"] = {
  ...schemas["Box"],
  ...transitionProps
};

// Relationship type elements need a relationship schema
schemas["Relationship"] = { ...schemas["Relationship"], ...relationshipSchema };

// Relationship type elements need a relationship schema
schemas["Property"] = {
  ...schemas["Property"],
  ...transitionProps,
  transformer: ({ element, root, context, level }) => {
    switch (element.propertyType) {
      case "Background":
        return { backgroundColor: element.value };
      case "Opacity":
        return { opacity: element.value };
    }
  }
};

export default schemas;
