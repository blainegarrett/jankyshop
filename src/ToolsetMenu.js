// ToolSet Menu
import React from 'react';
import List from '@material-ui/core/List';
import ToolsetButton from './ToolsetButton';
import Brightness6 from '@material-ui/icons/Brightness6';
import MailIcon from '@material-ui/icons/Mail';
import PaletteIcon from '@material-ui/icons/Palette';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  menuButton: {
    padding: 24
  },
  menu: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

let toolsetOptions = [
  {
    id: 'adjust',
    label: 'Adjustments',
    icon: <Brightness6 />
  },
  {
    id: 'experiments',
    label: 'Experiments',
    icon: <MailIcon />
  },
  {
    id: 'colors',
    label: 'Colors',
    icon: <PaletteIcon />
  }
];

export default function ToolsetMenu({ onItemClick, selectedToolset }) {
  let classes = useStyles();

  let menuItems = toolsetOptions.map((option, i) => {
    return (
      <ToolsetButton
        key={i}
        id={option.id}
        classes={{ root: classes.menuButton }}
        icon={option.icon}
        label={option.label}
        selected={option.id === selectedToolset}
        onClick={onItemClick}
      />
    );
  });
  return <List classes={{ root: classes.menu }}>{menuItems}</List>;
}
