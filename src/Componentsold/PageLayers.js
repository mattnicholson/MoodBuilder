import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import StoreGetElements from "./StoreGetElements";
import ActionToggle from "./ActionToggle";
import ActionDelete from "./ActionDelete";
import icons from "../icons";
import action from "../actions";
import useStore from "../store";

const useTreeItemStyles = makeStyles(theme => ({
  root: {},
  content: {},
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: 8
    }
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },
  labelIcon: {
    marginRight: theme.spacing(1),
    fontSize: 14,
    height: 14,
    lineHeight: 1,
    "& *": {
      fontSize: 14,
      opacity: 0.7
    }
  },
  labelInfo: {
    height: 14,
    lineHeight: 1,

    "& *": {
      fontSize: 12,
      opacity: 0.8
    }
  },
  labelText: {
    fontSize: 12,
    fontWeight: "inherit",
    flexGrow: 1
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo: LabelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {LabelIcon ? (
            <div color="inherit" className={classes.labelIcon}>
              {LabelIcon}
            </div>
          ) : null}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <div className={classes.labelInfo}>
            {LabelInfo ? LabelInfo : null}
          </div>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 400
  }
});

function TreeLayers({ element, type = [] }) {
  if (!element.children) return null;
  if (!element.children.length) return null;

  let actionContextID = useStore(state => state.actionContextID);

  return (
    <StoreGetElements id={element.children} type={type}>
      {({ elements }) =>
        elements.map(item => (
          <StyledTreeItem
            nodeId={item.id}
            labelText={item.title}
            labelIcon={actionContextID == item.id ? icons["edit"].icon : null}
            onClick={() => {
              if (item.type == "Layer") {
                action("SET_ACTION_CONTEXT", { id: item.id });
              }
            }}
            labelInfo={
              <React.Fragment>
                <ActionToggle
                  prop={"hidden"}
                  element={item}
                  on={icons["hide"].icon}
                  off={icons["show"].icon}
                />
                <ActionDelete element={item} icon={icons["delete"].icon} />
              </React.Fragment>
            }
          >
            {item.children.length ? <TreeLayers element={item} /> : null}
          </StyledTreeItem>
        ))
      }
    </StoreGetElements>
  );
}

export default function PageLayers({ page }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TreeView
        className={classes.root}
        defaultExpanded={[]}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={null}
      >
        <TreeLayers element={page} type={["Layer"]} />

        {/*
      <StyledTreeItem
        nodeId="1"
        labelText="Layer 1"
        labelIcon={null}
        labelInfo={icons["show"].icon}
      >
        <StyledTreeItem
          nodeId="5"
          labelText="Layout 1"
          labelIcon={icons["layout"].icon}
          labelInfo={icons["hide"].icon}
        >
          <StyledTreeItem
            nodeId="123"
            labelText="Block 1"
            labelIcon={null}
            labelInfo={icons["show"].icon}
          />
        </StyledTreeItem>
      </StyledTreeItem>
      <StyledTreeItem
        nodeId="2"
        labelText="Layer 2"
        labelIcon={null}
        labelInfo={icons["show"].icon}
      />
      <StyledTreeItem
        nodeId="3"
        labelText="Layer 3"
        labelIcon={null}
        labelInfo={icons["show"].icon}
      >
        <StyledTreeItem
          nodeId="5"
          labelText="Layout 1"
          labelIcon={icons["text"].icon}
          labelInfo={icons["show"].icon}
        />
      </StyledTreeItem>
      */}
      </TreeView>

      <Typography align={"center"}>
        <div onClick={() => action("ADD_LAYER", { parent: page.id })}>
          <IconButton aria-label="add" color="primary">
            <AddIcon />
          </IconButton>
        </div>
      </Typography>
    </React.Fragment>
  );
}
