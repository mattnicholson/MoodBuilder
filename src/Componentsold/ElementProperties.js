import React, { useEffect, useState } from "react";

import Element from "./Edit/Element.js";
import useStore from "../store.js";
import { hasVariants, defaults } from "../store.js";
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
              value={`0`}
              onChange={() => {}}
            >
              <div>
                {keyframes.map((keyframe, ix) => (
                  <div style={{ display: "inline-block" }}>
                    <FormControlLabel
                      value={`${ix}`}
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

export default function ElementProperties({ element, children }) {
  const useVariants = hasVariants(element.type);
  const activeKeyFrameID = useStore(state => state.activeKeyFrameID);
  const activeStateID = useStore(state => state.activeStateID);
  const elements = useStore(state => state.elements);

  let properties = {};
  let keyFrameID = 0;

  if (!element.hasOwnProperty("id")) return null;
  if (!useVariants) {
    // Not a variant type = just send on the data
    properties = { ...element.data };
  } else {
    // First keyframe in intial state as default data...
    const initialKeyframeID =
      elements[element.id].variants[defaults.STATE_INITIAL_ID].keyframes[0];
    // Load default data from initial keyframe
    const data = initialKeyframeID ? elements[initialKeyframeID].data : {};
    // Get active keyframe
    const activeKeyFrame = activeKeyFrameID ? elements[activeKeyFrameID] : null;
    const overrides = activeKeyFrame ? activeKeyFrame.data : {};
    // Merge default with active
    const merged = { ...data, ...overrides };
    // Update the properties
    properties = merged;

    keyFrameID = activeKeyFrameID ? activeKeyFrameID : initialKeyframeID;
  }

  const props = [
    "w",
    "h",
    "x",
    "y",
    "background",
    "borderRadius",
    "opacity"
  ].map(p => ({
    key: p,
    value: properties[p]
  }));

  if (children) {
    let obj = {};
    props.forEach(p => {
      obj[p.key] = p.value;
    });
    return children(properties);
  }
  return (
    <div>
      {props.map(p => (
        <div>
          <Grid container>
            <Grid item xs={4}>
              {p.key}:
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={p.value}
                onChange={e => {
                  let data = {};
                  data[p.key] = e.target.value;

                  action("UPDATE_ELEMENT", {
                    id: hasVariants(element.type) ? keyFrameID : element.id,
                    data: {
                      data: data
                    }
                  });
                }}
              />
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
}
