import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import Tooltip from "./BlackTooltip";

import icons from "../icons";
import action from "../actions";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& *": {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: "center",
      minWidth: 0,
      margin: `0 auto`
    },
    "& svg": {}
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function ToolBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Divider />
      <List component="nav" dense={true} aria-label="main mailbox folders">
        <Tooltip title="Add Blank Box" placement="right">
          <ListItem
            button
            onClick={() =>
              action("CONTEXT_ACTION", { action: "ADD_BLANK_BOX" })
            }
          >
            <ListItemIcon>{icons["spacer"].icon}</ListItemIcon>
          </ListItem>
        </Tooltip>

        <Tooltip title="Add Text" placement="right">
          <ListItem
            button
            onClick={() => action("CONTEXT_ACTION", { action: "ADD_TEXT" })}
          >
            <ListItemIcon>{icons["text"].icon}</ListItemIcon>
          </ListItem>
        </Tooltip>
        <Tooltip title="Add Image" placement="right">
          <ListItem
            button
            onClick={() => action("CONTEXT_ACTION", { action: "ADD_IMAGE" })}
          >
            <ListItemIcon>{icons["image"].icon}</ListItemIcon>
          </ListItem>
        </Tooltip>
      </List>
      <Divider />
      <List component="nav" dense={true} aria-label="main mailbox folders">
        <Tooltip title="New Arrangement" placement="right">
          <ListItem
            button
            onClick={() =>
              action("CONTEXT_ACTION", { action: "ADD_ARRANGEMENT" })
            }
          >
            <ListItemIcon>{icons["layout"].icon}</ListItemIcon>
          </ListItem>
        </Tooltip>
      </List>
      <Divider />
    </div>
  );
}
