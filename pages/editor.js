import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ToolsetMenu from '../src/ToolsetMenu';
import ToolSetDrawer from '../src/ToolSetDrawer';
import EditorContent from '../src//canvas';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    backgroundColor: 'transparent',
    //boxShadow: 'none',
    //left: 73,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },

  menuButton: {
    padding: 24
  },
  hide: {
    display: 'none'
  },

  toolOptionsDrawer: {
    width: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    //border: '2px solid red',
    zIndex: 300
  },
  toolOptionsDrawerOpen: {
    top: 70,
    width: 243,
    left: 73,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  toolOptionsDrawerClose: {
    top: 70,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden'
    //width: theme.spacing(7) + 1,
    //[theme.breakpoints.up('sm')]: {
    //  width: theme.spacing(9) + 1
    //}
  },

  drawer: {
    width: 73,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: 301
  },
  drawerOpen: {
    top: 70,
    width: 73,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    top: 70,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [selectedToolset, setSelectedToolset] = React.useState(false);

  // probably use dispatch...
  const [command, setCommand] = React.useState(false);

  const [toolOptionsDrawerOpen, setToolOptionsDrawerOpen] = React.useState(
    false
  );

  const handleDrawerOpen = () => {
    setToolOptionsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setToolOptionsDrawerOpen(false);
  };

  function toolChangeHandler(payload) {
    setCommand(payload);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Janky Shop
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: toolOptionsDrawerOpen,
          [classes.drawerClose]: !toolOptionsDrawerOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        open={open}
      >
        <ToolsetMenu
          selectedToolset={selectedToolset}
          onItemClick={toolsetId => {
            setSelectedToolset(toolsetId);
            handleDrawerOpen();
          }}
        />
      </Drawer>

      <Drawer
        variant="persistent"
        className={clsx(classes.toolOptionsDrawer, {
          [classes.toolOptionsDrawerOpen]: toolOptionsDrawerOpen,
          [classes.toolOptionsDrawerClose]: !toolOptionsDrawerOpen
        })}
        classes={{
          paper: clsx({
            [classes.toolOptionsDrawerOpen]: toolOptionsDrawerOpen,
            [classes.toolOptionsDrawerClose]: !toolOptionsDrawerOpen
          })
        }}
        open={toolOptionsDrawerOpen}
      >
        {selectedToolset && (
          <ToolSetDrawer
            selectedToolset={selectedToolset}
            handleClose={handleDrawerClose}
            onCommand={toolChangeHandler}
          />
        )}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <EditorContent command={command} />
      </main>
    </div>
  );
}
