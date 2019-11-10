// ToolSet Menu Option
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';

export default function ToolsetButton({
  classes,
  id,
  icon,
  label,
  onClick,
  selected
}) {
  return (
    <ListItem
      selected={selected}
      className={classes.root}
      button
      key={label}
      onClick={() => onClick(id)}
    >
      <Tooltip title={label} aria-label={label}>
        <ListItemIcon>{icon}</ListItemIcon>
      </Tooltip>
    </ListItem>
  );
}
