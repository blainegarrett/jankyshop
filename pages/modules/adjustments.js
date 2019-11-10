function getColorAtOffset(x, y, sourceCtx) {
  var p = sourceCtx.getImageData(x, y, 1, 1).data;
  return p;
}

function euclidian_distance(r1, g1, b1, r2, g2, b2) {
  let d = Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );

  //console.log(d);
  return d;
}

export function brightness(w, h, sourceData, adjustment) {
  var d = sourceData.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] += adjustment;
    d[i + 1] += adjustment;
    d[i + 2] += adjustment;
  }
  return sourceData;
}

export function threshold(w, h, sourceData, threshold_value) {
  var pixels = sourceData.data;
  let r, g, b;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var index = y * w * 4 + x * 4; //(y*w + x)*4;

      r = pixels[index + 0];
      g = pixels[index + 1];
      b = pixels[index + 2];

      var value = 0.3 * r + 0.59 * g + 0.11 * b >= threshold_value ? 255 : 0;

      pixels[index + 0] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
      pixels[index + 3] = pixels[index + 3];
    }
  }
  return sourceData;
}
export function invert(w, h, imgData) {
  var i;
  for (i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
    imgData.data[i + 3] = 255;
  }
  return imgData;
}

export function greyscale(w, h, sourceData) {
  var pixels = sourceData.data;
  var gray, r, g, b, a;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var index = y * w * 4 + x * 4; //(y*w + x)*4;

      r = pixels[index + 0];
      g = pixels[index + 1];
      b = pixels[index + 2];
      a = pixels[index + 3];

      gray = (r >> 2) + (g >> 1) + (b >> 2);

      pixels[index + 0] = gray;
      pixels[index + 1] = gray;
      pixels[index + 2] = gray;
      pixels[index + 3] = a;
    }
  }
  return sourceData;
}

export function quantize(w, h, sourceData) {
  // Euclidian

  let min_d = 100000; // u max?
  let d, c, new_r, new_g, new_b, r, g, b, a;

  let pallet = [
    [96, 25, 37],
    [169, 131, 130],
    [108, 95, 87],
    [177, 173, 170],
    [161, 174, 167],
    [254, 249, 229],
    [33, 33, 33]
  ];

  for (var j = 0; j < pallet.length; j++) {
    c = pallet[j];
    d = euclidian_distance(0, 0, 0, c[0], c[1], c[2]);

    if (d < min_d) {
      new_r = c[0];
      new_g = c[1];
      new_b = c[2];
      min_d = d;
    }
  }

  //console.log("New Nearest pallet color");
  //console.log([new_r, new_g, new_b]);
  //return;

  var pixels = sourceData.data;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var index = y * w * 4 + x * 4; //(y*w + x)*4;

      r = pixels[index + 0];
      g = pixels[index + 1];
      b = pixels[index + 2];
      a = pixels[index + 3];

      // find min euclidian distance
      let min_d = 100000; // u max?
      let new_r = 255;
      let new_g = 255;
      let new_b = 255;

      for (j = 0; j < pallet.length; j++) {
        c = pallet[j];
        d = euclidian_distance(r, g, b, c[0], c[1], c[2]);
        if (d < min_d) {
          new_r = c[0];
          new_g = c[1];
          new_b = c[2];
          min_d = d;

          // if d is within a certain threshold, call it good enough
        }
      }

      pixels[index + 0] = new_r;
      pixels[index + 1] = new_g;
      pixels[index + 2] = new_b;
      pixels[index + 3] = a;
    }
  }
}

export function halftone(
  w,
  h,
  sourceData,
  { globalGridCoords, sourceCtx, polyCtx, value }
) {
  let threshold = value;
  let grid_size = 50;
  //var pixels = sourceData.data;

  polyCtx.clearRect(0, 0, w, h);
  //threshold_value = 100;
  greyscale(w, h, sourceData);
  //brightness(w, h, sourceData, threshold);

  //var polyData = polyCtx.getImageData(0, 0, w, h);

  for (var p = 0; p < globalGridCoords.length; p++) {
    let coord = globalGridCoords[p];
    //let x1 = p[0];
    //let x2 = p[0] + grid_size;
    //let y2 = p[1];
    //let y1 = p[1] + grid_size;

    // Get color at px
    let x = coord[0] + Math.floor(grid_size / 2);
    let y = coord[1] + Math.floor(grid_size / 2);
    var pixels = getColorAtOffset(x, y, sourceCtx);

    var factor = pixels[0] * 0.3 + pixels[1] * 0.59 + pixels[2] * 0.11;
    //var value = factor > threshold_value ? 255 : 0; // threshold

    let v = 255 - threshold;
    if (v > 500) {
      v = 255;
    }

    let r = ((v - factor) * (grid_size / 2)) / v;

    if (r > 0) {
      drawCircle(sourceCtx, polyCtx, x, y, r, '#000000');
    }
  }
}

export function coolMosaic(
  w,
  h,
  sourceData,
  { globalGridCoords, sourceCtx, polyCtx, value }
) {
  polyCtx.clearRect(0, 0, w, h);
  let grid_size = 50;
  let r = 2 * grid_size;
  let x = 0;
  let y = 0;

  let n = 2; //Math.floor(w / grid_size);
  let i;
  let z = 0;
  for (i = 0; i < globalGridCoords.length; i = z) {
    x = globalGridCoords[i][0];
    y = globalGridCoords[i][1];

    if (x == 0 && i % n !== 0) {
      //z += n + n; /// 2;
    } else {
      z += n;
      //z += n * 2;
    }

    drawDiamond(sourceCtx, polyCtx, x, y, r);
    drawCircle(sourceCtx, polyCtx, x, y + r / 2, grid_size / 2 - 5);
    console.log(value);
    if (i % value == 0) {
      drawCircle(sourceCtx, polyCtx, x, y + r / 2, grid_size / 6);
    }
  }
}

function drawDiamond(sourceCtx, polyCtx, x, y, r, color) {
  // Draw a quadralateral with top at x,y with width of r

  var av = getColorAtOffset(x, y, sourceCtx);
  let fillColor = 'rgb(' + av[0] + ',' + av[1] + ',' + av[2] + ', 0.99)';

  // Triangle math
  polyCtx.beginPath();
  polyCtx.lineTo(x, y);
  polyCtx.lineTo(x + r / 2, y + r / 2);
  polyCtx.lineTo(x, y + r);
  polyCtx.lineTo(x - r / 2, y + r / 2);
  polyCtx.fillStyle = fillColor;
  polyCtx.fill();
  polyCtx.stroke();
}

function drawCircle(sourceCtx, polyCtx, x, y, r, color) {
  // Render Polys - play connect the dots
  //return drawHeart(sourceData, polyData, w, h, x, y, r);

  //var polyCtx = polyCanvasRef.current.getContext('2d');

  var av = getColorAtOffset(x, y, sourceCtx);

  if (!color) {
    let fillColor = 'rgb(' + av[0] + ',' + av[1] + ',' + av[2] + ', 0.8)';

    // Draw a cirlce
    polyCtx.beginPath();
    polyCtx.fillStyle = fillColor; // ("rgba(255, 255, 255, 0.5)");
    polyCtx.arc(x, y, r, 0, Math.PI * 2, true);

    polyCtx.strokeStyle = 'rgb(' + av[0] + ',' + av[1] + ',' + av[2] + ', 0.5)';
    polyCtx.lineWidth = r / 2;
    polyCtx.stroke();
  } else {
    polyCtx.beginPath();
    polyCtx.fillStyle = color;
    polyCtx.arc(x, y, r, 0, Math.PI * 2, true);
    polyCtx.fill();
  }

  //polyCtx.fill();

  polyCtx.beginPath();
  polyCtx.moveTo(300, 150);
}

export default {
  quantize,
  greyscale,
  invert,
  threshold,
  halftone,
  brightness,
  coolMosaic
};
