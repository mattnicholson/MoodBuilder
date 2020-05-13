import React, { useEffect, useState } from "react";

import Element from "./Edit/Element.js";
import useStore from "../store.js";
import action from "../actions.js";
import MicroPreview from "./MicroPreview";
import StoreGetElements from "./StoreGetElements";
import Tabs from "./Tabs";
import StoreGetSelectedElement from "./StoreGetSelectedElement";
import StoreGetKeyFramesForElement from "./StoreGetKeyFramesForElement";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";

function KeyFrames({ element, state: state }) {
  let activeKeyFrameID = useStore(state => state.activeKeyFrameID);
  let set = useStore(state => state.set);

  return (
    <div>
      <StoreGetKeyFramesForElement id={element.id} state={state}>
        {({ keyframes }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Keyframes for {element.title} @ {state}
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={activeKeyFrameID}
              onChange={e => {
                set(state => {
                  state.activeKeyFrameID = e.target.value;
                });
              }}
            >
              <div>
                {keyframes.map((keyframe, ix) => (
                  <div style={{ display: "inline-block" }}>
                    <FormControlLabel
                      value={`${keyframe}`}
                      control={<Radio />}
                      label={`${ix}`}
                    />
                  </div>
                ))}
              </div>
            </RadioGroup>
          </FormControl>
        )}
      </StoreGetKeyFramesForElement>
      <div
        onClick={() =>
          action("ADD_KEYFRAME_TO_ELEMENT", {
            id: element.id,
            state: state,
            value: Math.random()
          })
        }
      >
        <AddIcon />
      </div>
    </div>
  );
}

function TimeLineList({ ids, state: state, showChildren = true }) {
  return (
    <StoreGetElements id={ids}>
      {({ elements }) =>
        elements.map(item => (
          <React.Fragment key={item.id}>
            <TimeLine element={item} state={state} />
            {showChildren ? (
              <TimeLineList
                ids={item.children}
                state={state}
                showChildren={false}
              />
            ) : null}
          </React.Fragment>
        ))
      }
    </StoreGetElements>
  );
}

function TimeLine({ element, state: state }) {
  return (
    <StoreGetSelectedElement>
      {selected => (
        <>
          <Box
            p={0.5}
            style={{
              cursor: "pointer",
              opacity: selected.element.id == element.id ? 1 : 0.5
            }}
            onClick={() => action("SET_SELECTED_ELEMENT", { id: element.id })}
          >
            <div>
              <Grid container spacing={0}>
                <Grid item xs={3}>
                  {element.title}
                </Grid>
                <Grid item xs={9}>
                  <KeyFrames
                    element={element}
                    state={state}
                    enabled={selected.element.id == element.id}
                  />
                </Grid>
              </Grid>
            </div>
          </Box>
          <Divider />
        </>
      )}
    </StoreGetSelectedElement>
  );
}

export default function ElementStates({ element }) {
  const activeStateID = useStore(state => state.activeStateID);
  const elements = useStore(state => state.elements);
  const tabs = Object.values(elements).filter(e => e.type == "State");
  const active = tabs.find(e => e.id == activeStateID);
  const value = tabs.indexOf(active);

  return (
    <div>
      <Tabs
        tabs={tabs.map(e => e.title)}
        value={value < 0 ? 0 : value}
        onChange={(ev, ix) => {
          action("SET_ACTIVE_STATE", { id: tabs[ix].id });
        }}
      >
        <TimeLineList ids={element.children} state={activeStateID} />
      </Tabs>
    </div>
  );
}
