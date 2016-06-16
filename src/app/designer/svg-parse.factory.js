/* global Vec, Matrix */
/* eslint-disable no-magic-numbers, no-console */
angular.module("ushirt")
  .factory("svgParseFactory", () => {
    const idmat = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const maxShapeSize = 400;
    let canvas = null;
    let ctx = null;


    function parseSvgElement(element) {
      const viewBox = element.viewBox.split(" ");
      const width = parseInt(viewBox[2]) - parseInt(viewBox[0]);
      const height = parseInt(viewBox[3]) - parseInt(viewBox[1]);
      const tmat = idmat.slice();   //NOTE(adam): copy identity values to work from

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

      const newShape = new Shape(width, height, paths);
      Shape.addTransform(newShape, tmat);
      return newShape;
    }

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
      const tokens = data.split(" ");

      let startPoint = new Vec(0, 0);
      let curPoint = new Vec(0, 0);
      let lastControlPoint = new Vec(0, 0);

      // convert numbers from strings to ints
      tokens.forEach(token => {
        const num = parseInt(token, 10);
        if(!isNaN(num)) {
          token = num;
        }
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

            paths.push(new Path(startPoint));
            if(paths.length === 1) {
              Path.addCommand(paths[0], ctx.beginPath, []);     // if first path, add beginPath command
            }
            Path.addCommand(paths[paths.length - 1], ctx.moveTo, [
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
            Path.addCommand(paths[paths.length - 1], ctx.lineTo, [
              new Vec(curPoint.x, curPoint.y)
            ]);
            break;

          case "h":
            tokens[i + 1] += curPoint.x;
            // fallthrough
          case "H":
            curPoint.x = tokens[i + 1];
            i += 2;
            Path.addCommand(paths[paths.length - 1], ctx.lineTo, [
              new Vec(curPoint.x, curPoint.y)
            ]);
            break;

          case "v":
            tokens[i + 1] += curPoint.y;
            // fallthrough
          case "V":
            curPoint.y = tokens[i + 1];
            i += 2;
            Path.addCommand(paths[paths.length - 1], ctx.lineTo, [
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
            Path.addCommand(paths[paths.length - 1], ctx.bezierCurveTo, [
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
            Path.addCommand(paths[paths.length - 1], ctx.bezierCurveTo, [
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
            Path.addCommand(paths[paths.length - 1], ctx.quadraticCurveTo, [
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
            Path.addCommand(paths[paths.length - 1], ctx.quadraticCurveTo, [
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
            if(paths.length > 1 && ctx.isPointInPath(paths[paths.length - 1].startPoint.x, paths[paths.length - 1].startPoint.y)) {
              //console.log("in path");
              Path.reverse(paths[paths.length - 1]);
            }

            Path.addCommand(paths[paths.length - 1], ctx.closePath, []);

            curPoint = new Vec(startPoint.x, startPoint.y);
            ++i;
            break;

          default:
            console.log(`no match found for ${curCode}`);
            ++i;
        }
      }

      //NOTE(adam): clear the canvas after test drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      return paths;
    }

    function getCommandsFromPoints(data) {
      const tokens = data.split(" ");

      let i = 0;
      const startPoint = new Vec(tokens[i++], tokens[i++]);

      const path = new Path(startPoint);
      Path.addCommand(path, ctx.moveTo, [
        new Vec(startPoint.x, startPoint.y)
      ]);

      while(i + 1 < tokens.length) {
        Path.addCommand(path, ctx.lineTo, [
          new Vec(tokens[i], tokens[i + 1])
        ]);
        i += 2;
      }

      if(ctx.isPointInPath(startPoint.x, startPoint.y)) {
        Path.reverse(path);
      }

      //NOTE(adam): adding after to preserve reverseDirection
      Path.prependCommand(path, ctx.beginPath, []);
      Path.addCommand(path, ctx.closePath, []);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //NOTE(adam): returning array to match commands from data
      return [path];
    }


    //NOTE(adam): shape operations
    function Shape(width, height, paths) {
      this.initWidth = width;
      this.initHeight = height;
      this.width = width;
      this.height = height;
      this.paths = paths;

      this.transforms = [];
      this.finalTransform = idmat.slice();
    }

    Shape.drawShape = (shape, opts, tmat) => {
      let t = idmat.slice();
      if(tmat) {
        t = Matrix.multmm(tmat, shape.finalTransform);
      }

      shape.paths.forEach(function(path) {
        Path.transform(path, t);
        Path.draw(path);
      });

      if(opts) {
        ctx.fillStyle = opts.fillStyle;
        if(opts.fillStyle !== "none") {
          ctx.fill();
        }

        ctx.strokeStyle = opts.strokeStyle;
        ctx.lineWidth = opts.strokeWeight;
        if(opts.strokeStyle !== "none" && opts.strokeWeight !== 0) {
          ctx.stroke();
        }
      }
    };

    Shape.addTransform = (shape, tmat) => {
      shape.transforms.push(tmat);
      Shape.calcFinalTransform(shape);

      shape.width = Math.round(shape.initWidth * shape.finalTransform[0]);
      shape.height = Math.round(shape.initHeight * shape.finalTransform[4]);

      shape.paths.map(path => Path.transform(path, shape.finalTransform));
    };

    Shape.calcFinalTransform = shape => {
      let tmat = idmat.slice();
      shape.transforms.forEach(trans => tmat = Matrix.multmm(tmat, trans));
      shape.finalTransform = tmat;
    };


    //NOTE(adam): path operations
    function Path(startPoint) {
      this.startPoint = startPoint;
      this.commands = [];
    }
    Path.addCommand = (path, commandName, args) => {
      path.commands.push(new Command(commandName, args));
      Path.drawLastCommand(path);
    };

    Path.prependCommand = (path, commandName, args) => {
      path.commands.unshift(new Command(commandName, args));
      Path.drawLastCommand(path);
    };

    Path.reverse = path => {
      const first = path.commands.shift();
      path.commands.reverse().unshift(first);
    };

    Path.draw = path => path.commands.forEach(cmd => Command.execute(cmd));

    Path.drawLastCommand = path =>
      Command.execute(path.commands[path.commands.length - 1]);

    Path.transform = (path, tmat) =>
      path.commands.map(cmd => Command.transform(cmd, tmat));


    //NOTE(adam): command operations
    function Command(name, args) {
      this.name = name;
      this.args = args;
      this.tArgs = args.slice();
    }
    Command.execute = (cmd) => {
      const applyArgs = [];
      cmd.tArgs.forEach(a => applyArgs.push(a.x, a.y));
      cmd.name.apply(ctx, applyArgs);
    };

    Command.transform = (cmd, tmat) =>
      cmd.tArgs = cmd.args.map(a => Vec.transform(a, tmat)).slice();


    return {
      setup: (setCanvas, setCtx) => {canvas = setCanvas; ctx = setCtx;},
      parseElement: element => parseSvgElement(element),
      drawShape: shape => Shape.drawShape(shape, {fillStyle:"black", strokeStyle:"white", strokeWeight: 1}, idmat)
    };
  });
