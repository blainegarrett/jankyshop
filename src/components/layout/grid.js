import React from 'react';
import PropTypes from 'prop-types';
import MuiGrid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import classnames from 'clsx';

const useStyles = makeStyles(theme => {
  return {
    fluidContainer: {
      width: '100%',
      flexGrow: 1
    },
    legacyContainer: {
      marginRight: 'auto',
      marginLeft: 'auto',
      width: '100%', // xs,sm
      flexGrow: 1,
      paddingRight: theme.spacing(2), // 16
      paddingLeft: theme.spacing(2), // 16

      [theme.breakpoints.only('xs')]: {
        width: '100%'
      },
      [theme.breakpoints.only('sm')]: {
        width: '100%'
      },
      [theme.breakpoints.only('md')]: {
        width: theme.breakpoints.width('md')
      },
      [theme.breakpoints.only('lg')]: {
        width: theme.breakpoints.width('lg')
      },
      [theme.breakpoints.only('xl')]: {
        // force width of lg
        width: theme.breakpoints.width('lg')
      }
    },
    alignRight: { marginRight: 0 },
    alignLeft: { marginLeft: 0 },
    typeContainer: {},
    typeItem: {},
    gridWrapper: {
      overflow: 'hidden'
    }
  };
});

export function Grid({ align, className, children, fluid, ...rest }) {
  let classes = useStyles();
  let collectedClasses = [classes.gridWrapper, className];

  if (fluid) {
    collectedClasses.push(classes.fluidContainer);
  } else {
    collectedClasses.push(classes.legacyContainer);

    if (align) {
      if (align == 'right') {
        collectedClasses.push(classes.alignRight);
      } else if (align == 'left') {
        collectedClasses.push(classes.alignLeft);
      }
    }
  }
  return (
    <div className={classnames(collectedClasses)} {...rest}>
      {children}
    </div>
  );
}

Grid.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  fluid: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right'])
};

export function Row({ className, children, ...rest }) {
  let classes = useStyles();

  // TODO: What is spacing these days?
  return (
    <MuiGrid
      spacing={Number(4)} // theme.gutter.gutterSpacing
      container={true}
      className={classnames(classes.typeContainer, className)}
      {...rest}
    >
      {children}
    </MuiGrid>
  );
}
// prop definitions
Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object
};

export function Col(props) {
  let classes = useStyles();

  let { className, children, ...rest } = props;
  return (
    <MuiGrid
      item={true}
      {...rest}
      className={classnames(classes.typeItem, className)}
    >
      {children}
    </MuiGrid>
  );
}

Col.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object
};
