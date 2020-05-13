import React, { useEffect, useState } from "react";

import Dialog from "./Dialog.js";

import icons from "../icons";
import mappings from "../mappings";
import action from "../actions";
import useStore from "../store.js";

export default function DialogController({ page }) {
  const context = useStore(state => state.contextForDialog);

  const open = useStore(state => state.dialogOpen);
  const pendingDialog = useStore(state => state.pendingDialog);

  let text =
    pendingDialog &&
    mappings.dialogMessages.hasOwnProperty(pendingDialog.action)
      ? mappings.dialogMessages[pendingDialog.action]
      : mappings.dialogMessages.default;

  return (
    <Dialog
      open={open}
      title={text.title(context)}
      message={text.message(context)}
      cancelText={text.cancelText(context)}
      confirmText={text.confirmText(context)}
      onClose={() => action("CLOSE_DIALOG")}
      onConfirm={() => {
        action(pendingDialog.action, pendingDialog.params);
        action("CLOSE_DIALOG");
      }}
    />
  );
}
