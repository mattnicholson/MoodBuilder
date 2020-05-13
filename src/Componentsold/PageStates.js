import React, { useEffect, useState } from "react";

import Element from "./Edit/Element.js";
import useStore from "../store.js";
import action from "../actions.js";
import MicroPreview from "./MicroPreview";
import StoreGetElements from "./StoreGetElements";
import Tabs from "./Tabs";
import StoreGetActiveState from "./StoreGetActiveState";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

export default function PageStates({ page }) {
  const activeStateID = useStore(state => state.activeStateID);

  return (
    <div>
      <Tabs />
      <div
        style={{
          display: "inline-block",
          border: !activeStateID ? `1px solid white` : `1px solid transparent`
        }}
        onClick={() => action("SET_ACTIVE_STATE", { id: null })}
      >
        <MicroPreview page={page} />
      </div>
      <StoreGetElements id={page.children} type={["State"]}>
        {({ elements }) =>
          elements.map(item => (
            <div
              onClick={() => action("SET_ACTIVE_STATE", { id: item.id })}
              style={{
                display: "inline-block",
                border:
                  activeStateID == item.id
                    ? `1px solid white`
                    : `1px solid transparent`
              }}
            >
              <MicroPreview page={page} state={item.id} />
            </div>
          ))
        }
      </StoreGetElements>
      <div align={"center"}>
        <div onClick={() => action("ADD_STATE", { parent: page.id })}>
          <IconButton aria-label="add" color="primary">
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
