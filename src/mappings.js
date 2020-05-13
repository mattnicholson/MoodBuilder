const mappings = {
  contextMenuActions: {
    Page: [["duplicate"], ["delete"]],
    File: [["duplicate"], ["delete"]],
    Container: [["duplicate"], ["delete"]],
    Box: [["duplicate"], ["delete"]]
  },
  dialogMessages: {
    default: {
      title: element => `Perform this action?`,
      message: element => `Are you sure?`,
      cancelText: element => `Cancel`,
      confirmText: element => `Confirm`
    },
    DELETE_ELEMENT: {
      title: element => `Delete ${element.title}?`,
      message: element =>
        `This will remove ${element.title} and any nested elements.`,
      cancelText: element => `Cancel`,
      confirmText: element => `Delete`
    }
  },
  easings: {
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeOutExpo: [0.83, 0, 0.17, 1]
  }
};

export default mappings;
