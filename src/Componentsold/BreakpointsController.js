import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import LaptopIcon from "@material-ui/icons/Laptop";
import TvIcon from "@material-ui/icons/Tv";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PermDataSettingIcon from "@material-ui/icons/PermDataSetting";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import Tooltip from "@material-ui/core/Tooltip";
import icons from "../icons";
import action from "../actions";

const useStylesTooltip = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black
  },
  tooltip: {
    backgroundColor: theme.palette.common.black
  }
}));

function BlackTooltip(props) {
  const classes = useStylesTooltip();

  return <Tooltip arrow classes={classes} {...props} />;
}

const useStyles = makeStyles(theme => ({
  toggleContainer: {
    margin: theme.spacing(2, 0)
  },
  toggleGroup: {
    margin: theme.spacing(0, 2)
  }
}));

export default function DisplayController() {
  const [grid, setGrid] = React.useState([]);
  const [formats, setFormats] = React.useState(() => ["desktop"]);

  const handleFormat = (event, newFormats) => {
    if (newFormats !== null) {
      setFormats(newFormats);
    }
  };

  const handleGrid = (event, newGrid) => {
    setGrid(newGrid);
    action("TOGGLE_GRID_VIEWS", { active: newGrid });
  };

  const classes = useStyles();

  return (
    <div className={classes.toggleContainer}>
      <ToggleButtonGroup
        value={formats}
        onChange={handleFormat}
        aria-label="device"
        size="small"
        exclusive
        className={classes.toggleGroup}
      >
        <ToggleButton value="laptop" aria-label="laptop">
          <LaptopIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="desktop" aria-label="tv">
          <TvIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="phone" aria-label="phone">
          <PhoneAndroidIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={grid}
        onChange={handleGrid}
        aria-label="device"
        size="small"
        className={classes.toggleGroup}
      >
        <ToggleButton value="show" aria-label="show grid">
          <BlackTooltip title="Show Grid" placement="top" arrow>
            <ViewColumnIcon fontSize="small" />
          </BlackTooltip>
        </ToggleButton>

        <ToggleButton value="settings" aria-label="grid settings">
          <BlackTooltip title="Grid Settings" placement="top" arrow>
            {icons["settingsBreakpoints"].icon}
          </BlackTooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
