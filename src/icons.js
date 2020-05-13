import React from "react";
import Delete from "@material-ui/icons/Delete";
import FileCopy from "@material-ui/icons/FileCopy";
import ViewColumn from "@material-ui/icons/ViewColumn";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import LaptopIcon from "@material-ui/icons/Laptop";
import TvIcon from "@material-ui/icons/Tv";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import TabletMac from "@material-ui/icons/TabletMac";
import AspectRatio from "@material-ui/icons/AspectRatio";
import Image from "@material-ui/icons/Image";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import TextFields from "@material-ui/icons/TextFields";
import Layers from "@material-ui/icons/Layers";
import Brush from "@material-ui/icons/Brush";
import Palette from "@material-ui/icons/Palette";
import ViewQuilt from "@material-ui/icons/ViewQuilt";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import PermDataSettingIcon from "@material-ui/icons/PermDataSetting";
import TuneIcon from "@material-ui/icons/Tune";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BorderVerticalIcon from "@material-ui/icons/BorderVertical";
import BorderTopIcon from "@material-ui/icons/BorderTop";
import BorderRightIcon from "@material-ui/icons/BorderRight";
import Crop75Icon from "@material-ui/icons/Crop75";
import CropPortraitIcon from "@material-ui/icons/CropPortrait";
import HeightIcon from "@material-ui/icons/Height";
import SpaceBarIcon from "@material-ui/icons/SpaceBar";
import EditIcon from "@material-ui/icons/Edit";
import SquareFootIcon from "@material-ui/icons/SquareFoot";
import TheatersIcon from "@material-ui/icons/Theaters";
// See https://material-ui.com/components/material-icons/

const icons = {
  frames: {
    icon: <TheatersIcon />,
    label: "Frames"
  },
  edit: {
    icon: <EditIcon />,
    label: "Edit"
  },
  gutter: {
    icon: <BorderVerticalIcon />,
    label: "Gutter"
  },
  spacingTop: {
    icon: <BorderTopIcon />,
    label: "Top Spacing"
  },
  spacingEdge: {
    icon: <BorderRightIcon />,
    label: "Edge Spacing"
  },
  delete: {
    icon: <Delete />,
    label: "Delete"
  },
  duplicate: {
    icon: <FileCopy />,
    label: "Duplicate"
  },
  alignLeft: {
    icon: <FormatAlignLeftIcon />,
    label: "Left Align"
  },
  alignCenter: {
    icon: <FormatAlignCenterIcon />,
    label: "Centre Align"
  },
  alignRight: {
    icon: <FormatAlignRightIcon />,
    label: "Right Align"
  },
  justify: {
    icon: <FormatAlignJustifyIcon />,
    label: "Justify"
  },
  laptop: {
    icon: <LaptopIcon />,
    label: "Laptop"
  },
  desktop: {
    icon: <TvIcon />,
    label: "Desktop"
  },
  tablet: {
    icon: <TabletMac />,
    label: "Tablet"
  },
  mobile: {
    icon: <PhoneAndroidIcon />,
    label: "Mobile"
  },
  columns: {
    icon: <ViewColumn />,
    label: "View Column Grid"
  },
  spacer: {
    icon: <AspectRatio />,
    label: "Spacer"
  },
  image: {
    icon: <Image />,
    label: "Image"
  },
  text: {
    icon: <TextFields />,
    label: "Text"
  },
  carousel: {
    icon: <ViewCarousel />,
    label: "Carousel"
  },
  layer: {
    icon: <Layers />,
    label: "Layer"
  },
  brush: {
    icon: <Brush />,
    label: "Brush"
  },
  palette: {
    icon: <Palette />,
    label: "Palette"
  },
  layout: {
    icon: <ViewQuilt />,
    label: "Layout"
  },
  addBlock: {
    icon: <LibraryAdd />,
    label: "Add Block"
  },
  settingsBreakpoints: {
    icon: <SquareFootIcon fontSize="small" />,
    label: "Screen Settings"
  },
  properties: {
    icon: <TuneIcon />,
    label: "Properties"
  },
  files: {
    icon: <PermMediaIcon />,
    label: "Files"
  },
  show: {
    icon: <VisibilityIcon />,
    label: "Show"
  },
  hide: {
    icon: <VisibilityOffIcon />,
    label: "Show"
  }
};

export default icons;
