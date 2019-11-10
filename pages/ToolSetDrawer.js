// ToolSet Menu
import React from 'react';
import Brightness6 from '@material-ui/icons/Brightness6';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    borderBottom: '1px solid #333333'
  },
  optionContainer: {
    padding: 32
  }
}));

let adjustOptions = [
  {
    id: 'threshold',
    label: 'Threshold',
    type: 'slider',
    onChange: value => {
      return { type: 'COMMAND', id: 'threshold', value };
    }
  },
  {
    id: 'brightness',
    label: 'Brightness',
    type: 'slider',
    onChange: value => {
      return { type: 'COMMAND', id: 'brightness', value };
    }
  },
  {
    id: 'greyscale',
    label: 'Greyscale',
    type: 'boolean',
    onChange: () => {
      return { type: 'COMMAND', id: 'greyscale', value: true };
    }
  },
  {
    id: 'invert',
    label: 'Invert',
    type: 'boolean',
    onChange: () => {
      return { type: 'COMMAND', id: 'invert', value: true };
    }
  },
  {
    id: 'quantize',
    label: 'Quantize',
    type: 'boolean',
    onChange: () => {
      return { type: 'COMMAND', id: 'quantize', value: true };
    }
  },
  {
    id: 'halftone',
    label: 'Halftone',
    type: 'slider',
    onChange: value => {
      return { type: 'COMMAND', id: 'halftone', value: value };
    }
  }
];

let colorOptions = [
  {
    id: 'quantize',
    label: 'Quantize',
    type: 'boolean',
    onChange: () => {
      return { type: 'COMMAND', id: 'quantize', value: true };
    }
  }
];

let experimentOptions = [
  {
    id: 'coolmosaic',
    label: 'Cool Mosaic',
    type: 'slider',
    onChange: value => {
      return { type: 'COMMAND', id: 'coolmosaic', value: value };
    }
  },
  {
    id: 'coolstuff',
    label: 'Cool Stuff',
    icon: <MailIcon />,
    onChange: () => {
      console.log('cooooolstuff');
    }
  }
];

let toolbarSets = {
  adjust: { name: 'Adjustments', options: adjustOptions },
  experiments: { name: 'Experiments', options: experimentOptions },
  colors: { name: 'Colors', options: colorOptions }
};

export default function ToolSetDrawer(props) {
  let { onCommand, selectedToolset, handleClose } = props;

  let classes = useStyles();

  function onChange(id) {
    return (e, newValue) => {
      let idx = toolbarSets[selectedToolset].options.findIndex(o => o.id == id);

      let option = toolbarSets[selectedToolset].options[idx];

      // Dispatch ??
      onCommand({ ...option.onChange(newValue), toolset: selectedToolset });
    };
  }

  let optionItems = toolbarSets[selectedToolset].options.map((option, i) => {
    // Case out input type...
    let inputs = <div>not implemented</div>;
    if (option.type === 'slider') {
      inputs = (
        <div>
          <Slider
            defaultValue={30}
            //getAriaValueText={'derp'}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            //step={10}
            //marks
            min={-255}
            max={255}
            onChange={onChange(option.id)}
          />
        </div>
      );
    } else if (option.type === 'boolean') {
      inputs = <Button onClick={onChange(option.id)}>Apply</Button>;
    }

    return (
      <div key={i}>
        <div>
          <b>{option.label}</b>
          {inputs}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className={classes.toolbar}>
        <b>{toolbarSets[selectedToolset].name}</b>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <div className={classes.optionContainer}>{optionItems}</div>
    </div>
  );
}
