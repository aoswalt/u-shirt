/* global Vec, Matrix */
/* eslint-disable no-magic-numbers, no-console */
var Art = (function(art) {  // eslint-disable-line no-var
  const maxShapeSize = 400;
  art.ctx = null;

  art.setContext = ctx => art.ctx = ctx;

  art.parseSvg = function(element) {
    const viewBox = element.viewBox.split(" ");
    const width = parseInt(viewBox[2]) - parseInt(viewBox[0]);
    const height = parseInt(viewBox[3]) - parseInt(viewBox[1]);
    const tmat = Matrix.idmat.slice();   //NOTE(adam): copy identity values to work from

    let paths = [];   //NOTE(adam): paths to make up the svg

    switch(element.type) {
      case "path":
        paths = paths.concat(getCommandsFromData(cleanPathString(element.data)));
        break;
      case "polygon":
        paths = paths.concat(getCommandsFromPoints(cleanPolygonString(element.data)));
        break;
      default:
        console.log(`${element.type} not implemented`);
    }

    let scale = 1;
    if(width > height) {
      scale = maxShapeSize / width;
    } else {
      scale = maxShapeSize / height;
    }

    tmat[0] = scale;
    tmat[4] = scale;

    const newShape = new Art.Shape(width, height, paths);
    Art.Shape.addTransform(newShape, tmat);
    return newShape;
  };

  //TODO(adam): combine clean strings?
  function cleanPathString(d) {
    return d.replace(/,/gm, " ")
    .replace(/([MmLlHhVvCcSsQqTtAaZz])([MmLlHhVvCcSsQqTtAaZz])/gm, "$1 $2")
    .replace(/([MmLlHhVvCcSsQqTtAaZz])([^\s])/gm, "$1 $2")
    .replace(/([^\s])([MmLlHhVvCcSsQqTtAaZz])/gm, "$1 $2")
    .replace(/[\s\r\t\n]+/gm, " ")
    .replace(/[\s+]$/, "");
  }

  function cleanPolygonString(d) {
    return d.replace(/,/gm, " ")
    .replace(/[\s\r\t\n]+/gm, " ")
    .replace(/[\s+]$/, "");
  }

  function getCommandsFromData(data) {
    //console.log(data);
    const paths = [];
    let tokens = data.split(" ");

    let startPoint = new Vec(0, 0);
    let curPoint = new Vec(0, 0);
    let lastControlPoint = new Vec(0, 0);

    // convert numbers from strings to ints
    tokens = tokens.map(token => {
      const num = parseInt(token, 10);
      return !isNaN(num) ? num : token;
    });

    let curCode = "";
    for(let i = 0; i < tokens.length; ) {
      if(typeof(tokens[i]) === "string" && tokens[i].match(/([MmLlHhVvCcSsQqTtAaZz])/)) {
        curCode = tokens[i];
      } else {
        --i;    // move index back since argument parsing assumes starting at letter
      }

      switch(curCode) {
        case "m":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          // fallthrough
        case "M":
          curPoint = new Vec(tokens[i + 1], tokens[i + 2]);
          i += 3;

          startPoint = new Vec(curPoint.x, curPoint.y);

          paths.push(new Art.Path(startPoint));
          if(paths.length === 1) {
            Art.Path.addCommand(paths[0], art.ctx.beginPath, []);     // if first path, add beginPath command
          }
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.moveTo, [
            new Vec(curPoint.x, curPoint.y)
          ]);
          break;

        case "l":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          // fallthrough
        case "L":
          curPoint = new Vec(tokens[i + 1], tokens[i + 2]);
          i += 3;
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.lineTo, [
            new Vec(curPoint.x, curPoint.y)
          ]);
          break;

        case "h":
          tokens[i + 1] += curPoint.x;
          // fallthrough
        case "H":
          curPoint.x = tokens[i + 1];
          i += 2;
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.lineTo, [
            new Vec(curPoint.x, curPoint.y)
          ]);
          break;

        case "v":
          tokens[i + 1] += curPoint.y;
          // fallthrough
        case "V":
          curPoint.y = tokens[i + 1];
          i += 2;
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.lineTo, [
            new Vec(curPoint.x, curPoint.y)
          ]);
          break;

        case "c":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          tokens[i + 3] += curPoint.x;
          tokens[i + 4] += curPoint.y;
          tokens[i + 5] += curPoint.x;
          tokens[i + 6] += curPoint.y;
          // fallthrough
        case "C":
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.bezierCurveTo, [
            new Vec(tokens[i + 1], tokens[i + 2]),
            new Vec(tokens[i + 3], tokens[i + 4]),
            new Vec(tokens[i + 5], tokens[i + 6])
          ]);

          lastControlPoint = new Vec(tokens[i + 3], tokens[i + 4]);
          curPoint = new Vec(tokens[i + 5], tokens[i + 6]);
          i += 7;
          break;

        case "s":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          tokens[i + 3] += curPoint.x;
          tokens[i + 4] += curPoint.y;
          // fallthrough
        case "S":
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.bezierCurveTo, [
            lastControlPoint.clone(),
            new Vec(tokens[i + 1], tokens[i + 2]),
            new Vec(tokens[i + 3], tokens[i + 4])
          ]);

          lastControlPoint = new Vec(tokens[i + 1], tokens[i + 2]);
          curPoint = new Vec(tokens[i + 3], tokens[i + 4]);
          i += 5;
          break;

        case "q":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          tokens[i + 3] += curPoint.x;
          tokens[i + 4] += curPoint.y;
          // fallthrough
        case "Q":
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.quadraticCurveTo, [
            new Vec(tokens[i + 1], tokens[i + 2]),
            new Vec(tokens[i + 3], tokens[i + 4])
          ]);

          lastControlPoint = new Vec(tokens[i + 1], tokens[i + 2]);
          curPoint = new Vec(tokens[i + 3], tokens[i + 4]);
          i += 5;
          break;

        case "t":
          tokens[i + 1] += curPoint.x;
          tokens[i + 2] += curPoint.y;
          // fallthrough
        case "T":
          Art.Path.addCommand(paths[paths.length - 1], art.ctx.quadraticCurveTo, [
            lastControlPoint.clone(),
            new Vec(tokens[i + 1], tokens[i + 2])
          ]);

          curPoint = new Vec(tokens[i + 1], tokens[i + 2]);
          i += 3;
          break;

        case "a":
        case "A":
          // need conversion between endpoint and center parameterization
          console.warn(`${curCode} not implemented`);
          break;

        case "z":
        case "Z":
          //console.log(paths[paths.length - 1].startX + ", " + paths[paths.length - 1].startY)
          // may not work on more complex paths, needs further testing
          if(paths.length > 1 && art.ctx.isPointInPath(paths[paths.length - 1].startPoint.x, paths[paths.length - 1].startPoint.y)) {
            //console.log("in path");
            Art.Path.reverse(paths[paths.length - 1]);
          }

          Art.Path.addCommand(paths[paths.length - 1], art.ctx.closePath, []);

          curPoint = new Vec(startPoint.x, startPoint.y);
          ++i;
          break;

        default:
          console.log(`no match found for ${curCode}`);
          ++i;
      }
    }

    //NOTE(adam): clear the canvas after test drawing
    art.ctx.clearRect(0, 0, art.ctx.canvas.width, art.ctx.canvas.height);

    return paths;
  }

  function getCommandsFromPoints(data) {
    const tokens = data.split(" ");

    let i = 0;
    const startPoint = new Vec(tokens[i++], tokens[i++]);

    const path = new Art.Path(startPoint);
    Art.Path.addCommand(path, art.ctx.moveTo, [
      new Vec(startPoint.x, startPoint.y)
    ]);

    while(i + 1 < tokens.length) {
      Art.Path.addCommand(path, art.ctx.lineTo, [
        new Vec(tokens[i], tokens[i + 1])
      ]);
      i += 2;
    }

    if(art.ctx.isPointInPath(startPoint.x, startPoint.y)) {
      Art.Path.reverse(path);
    }

    //NOTE(adam): adding after to preserve reverseDirection
    Art.Path.prependCommand(path, art.ctx.beginPath, []);
    Art.Path.addCommand(path, art.ctx.closePath, []);

    art.ctx.clearRect(0, 0, art.ctx.canvas.width, art.ctx.canvas.height);

    //NOTE(adam): returning array to match commands from data
    return [path];
  }

  return art;
}(Art || {}));
