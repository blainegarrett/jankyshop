import React, { useEffect, useReducer, useState, useLayoutEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import adjust from './modules/adjustments';

let globalGridCoords = [];

function appStateReducer(prevState, action) {
  let state = { ...prevState };

  switch (action.type) {
    case 'SOURCE_LOADED': {
      state.sourceWidth = action.width;
      state.sourceHeight = action.height;
      state.sourceLoaded = true;
      state.sourceLoading = false;
      return state;
    }
    default: {
      console.log('unknown action', action);
    }
  }
  return state;
}

function initialReducerAppState() {
  return {
    sourceWidth: 100,
    sourceHeight: 100,
    sourceLoading: false,
    sourceLoaded: false,
    sourceError: false
  };
}

let useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'scroll'
    },

    layerContainer: {
      display: 'block',
      border: '5px solid #222222',
      position: 'relative',
      backgroundColor: '#ffffff',

      '& canvas': {
        position: 'absolute',
        top: 0,
        left: 0
        //border: '10px solid purple'
      }
    }
  };
});

export default function EditorContent({ command }) {
  let [appState, appStateDispatch] = useReducer(
    appStateReducer,
    initialReducerAppState()
  );

  if (!process.browser) {
    return <b>loading</b>;
  }

  let classes = useStyles();

  // Canvases
  const sourceCanvasRef = React.useRef(null);
  const gridCanvasRef = React.useRef(null);
  const resultCanvasRef = React.useRef(null);
  const polyCanvasRef = React.useRef(null);
  const utilCanvasRef = React.useRef(null);

  function generateGrid(w, h, grid_size) {
    var grid_coords = [];
    var x,
      y = 0;

    for (x = 0; x <= w; x += grid_size) {
      for (y = 0; y <= h; y += grid_size) {
        grid_coords.push([x, y]);
      }
    }
    return grid_coords;
  }

  function renderGrid(drawIt) {
    let grid_size = 50;
    let gridCtx = gridCanvasRef.current.getContext('2d');

    var w = sourceCanvasRef.current.width;
    var h = sourceCanvasRef.current.height;

    var gridData = gridCtx.getImageData(0, 0, w, h);
    var pixels = gridData.data;

    globalGridCoords = generateGrid(w, h, grid_size);

    let coords = globalGridCoords;
    let coord;

    let x, y;

    for (let i = 0; i < globalGridCoords.length; i++) {
      coord = coords[i];
      x = coord[0];
      y = coord[1];
      var index = y * w * 4 + x * 4; //(y*w + x)*4;
      pixels[index + 0] = 0;
      pixels[index + 1] = 0;
      pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    }

    if (drawIt) {
      gridCtx.putImageData(gridData, 0, 0); // at coords 0,0

      // Place circles centered around dots
      for (let i = 0; i < coords.length; i++) {
        coord = coords[i];
        x = coord[0];
        y = coord[1];
        gridCtx.beginPath();
        gridCtx.arc(x, y, 2, 0, Math.PI * 2, true);
        gridCtx.stroke();
      }
    }
  }

  useEffect(() => {
    applyCommand(command);
  });
  useLayoutEffect(() => {
    if (appState.sourceLoaded) {
      return;
    }

    // Load Source Image
    let sourceLoaderDom = new Image();
    sourceLoaderDom.onload = sourceImageReadyCallback;
    sourceLoaderDom.crossOrigin = 'Anonymous';
    sourceLoaderDom.src =
      'https://storage.googleapis.com/cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fMTEzODAwMDE/card_large.png';
    //sourceLoaderDom.src =
    //  'https://storage.googleapis.com/cdn.mplsart.com/blainestuff/blaine_mosaic2.jpg';
    //sourceLoaderDom.src =
    //  'https://storage.googleapis.com/cdn.mplsart.com/blainestuff/blaine_face.jpg';
    sourceLoaderDom.src =
      'https://storage.googleapis.com/cdn.mplsart.com/blainestuff/about_wedding.jpg';
    //sourceLoaderDom.src = 'http://localhost:3000/static/testImages/pictor.png';

    renderGrid(true);

    function sourceImageReadyCallback() {
      if (sourceCanvasRef) {
        // Manually scale all canvases...

        utilCanvasRef.current.width = this.width;
        utilCanvasRef.current.height = this.height;
        sourceCanvasRef.current.width = this.width;
        sourceCanvasRef.current.height = this.height;
        resultCanvasRef.current.width = this.width;
        resultCanvasRef.current.height = this.height;
        gridCanvasRef.current.width = this.width;
        gridCanvasRef.current.height = this.height;

        polyCanvasRef.current.width = this.width;
        polyCanvasRef.current.height = this.height;

        // Dispatch to AppState that the Source has loaded
        appStateDispatch({
          type: 'SOURCE_LOADED',
          width: this.width,
          height: this.height
        });

        renderGrid();
        sourceCanvasRef.current
          .getContext('2d')
          .drawImage(sourceLoaderDom, 0, 0);

        resultCanvasRef.current
          .getContext('2d')
          .drawImage(sourceLoaderDom, 0, 0);
      }
    }
  });

  let [layers, setLayers] = useState({
    showSourceLayer: true,
    showGridLayer: true,
    showResultLayer: true,
    showPolyLayer: true,
    showUtilLayer: true
  });

  function toggleVisibility(layer) {
    return () => {
      layers[layer] = !layers[layer];
      setLayers({ ...layers });
    };
  }

  function applyCommand(command) {
    let w = sourceCanvasRef.current.width;
    let h = sourceCanvasRef.current.height;
    let resultData = resultCanvasRef.current
      .getContext('2d')
      .getImageData(0, 0, w, h);

    let data = resultData;
    let sourceData = sourceCanvasRef.current
      .getContext('2d')
      .getImageData(0, 0, w, h);

    // TODO: This should just load the filter from a list of filters and pass in value payload...

    if (command.id === 'threshold') {
      data = adjust.threshold(w, h, sourceData, command.value);
    }
    if (command.id === 'brightness') {
      data = adjust.brightness(w, h, sourceData, command.value);
    } else if (command.id === 'greyscale') {
      data = adjust.greyscale(w, h, sourceData);
    } else if (command.id === 'invert') {
      data = adjust.invert(w, h, sourceData);
    } else if (command.id === 'quantize') {
      adjust.quantize(w, h, data);
    } else if (command.id === 'halftone') {
      adjust.halftone(w, h, data, {
        globalGridCoords,
        sourceCtx: resultCanvasRef.current.getContext('2d'),
        polyCtx: polyCanvasRef.current.getContext('2d'),
        value: command.value
      });
    } else if (command.id === 'coolmosaic') {
      adjust.coolMosaic(w, h, data, {
        globalGridCoords,
        sourceCtx: resultCanvasRef.current.getContext('2d'),
        polyCtx: polyCanvasRef.current.getContext('2d'),
        value: command.value
      });
    }

    resultCanvasRef.current.getContext('2d').putImageData(data, 0, 0); // at coords 0,0
  }

  return (
    <>
      <div className={classes.jankyTools}>
        Layers:
        <input
          checked={layers.showSourceLayer}
          type="checkbox"
          onChange={toggleVisibility('showSourceLayer')}
        />
        Source -
        <input
          checked={layers.showPolyLayer}
          type="checkbox"
          onChange={toggleVisibility('showPolyLayer')}
        />
        Poly -
        <input
          checked={layers.showUtilLayer}
          type="checkbox"
          onChange={toggleVisibility('showUtilLayer')}
        />
        Util -
        <input
          checked={layers.showResultLayer}
          type="checkbox"
          onChange={toggleVisibility('showResultLayer')}
        />
        resultCanvasRef
      </div>

      <div className={classes.container}>
        <div
          className={classes.layerContainer}
          style={{
            height: appState.sourceHeight,
            width: appState.sourceWidth,
            transform: 'scale(1)'
          }}
        >
          <canvas
            ref={sourceCanvasRef}
            id="source"
            style={{
              display: layers.showSourceLayer ? 'inline-block' : 'none'
            }}
            //onClick={e => {
            //  console.log(sourceCanvasRef.current.offsetLeft);
            //
            //            const canvas = sourceCanvasRef.current;
            //          const ctx = canvas.getContext('2d');
            //        draw(ctx, {
            //        x: e.clientX - sourceCanvasRef.current.offsetLeft,
            //      y: e.clientY - sourceCanvasRef.current.offsetTop
            //  });
            //}}
          />

          <canvas
            ref={gridCanvasRef}
            id="grid-canvas"
            style={{ display: layers.showGridLayer ? 'inline-block' : 'none' }}
          />
          <canvas
            ref={resultCanvasRef}
            id="result_canvas"
            style={{
              display: layers.showResultLayer ? 'inline-block' : 'none'
            }}
          />
          <canvas
            ref={polyCanvasRef}
            id="poly_canvas"
            style={{ display: layers.showPolyLayer ? 'inline-block' : 'none' }}
          />
          <canvas
            ref={utilCanvasRef}
            id="utils_canvas"
            style={{ display: layers.showUtilLayer ? 'inline-block' : 'none' }}
          />
        </div>
      </div>
    </>
  );
}
