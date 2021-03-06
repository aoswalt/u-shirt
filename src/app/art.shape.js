/* global Matrix */
/* eslint-disable no-magic-numbers */

//NOTE(adam): shape operations
var Art = (function(art) {  // eslint-disable-line no-var
  const strokeWeightMod = 10;

  art.Shape = function(width, height, paths) {
    this.initWidth = width;
    this.initHeight = height;
    this.width = width;
    this.height = height;
    this.paths = paths;

    this.transforms = [];
    this.finalTransform = Matrix.idmat.slice();
  };


  art.Shape.drawShape = (shape, opts, tmat) =>
    drawShapeTo(shape, opts, tmat, art.ctx);

  art.Shape.drawThumb = (shape, opts, env, ctx) => {
    if(!ctx) return;

    const thumbCanvas = ctx.canvas;
    const shapeScale = 0.9;   //NOTE(adam): leave room around for spacing
    const canvasSize = thumbCanvas.width * shapeScale;
    const offset = thumbCanvas.width * (1 - shapeScale) / 2;  //NOTE(adam): mid
    const ws = canvasSize / env.width;
    const hs = canvasSize / env.height;
    const scale = Math.min(ws, hs);
    const wdiff = (canvasSize - env.width * scale) / 2;
    const hdiff = (canvasSize - env.height * scale) / 2;

    ctx.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);
    ctx.save();
    ctx.translate(-env.pos.x * scale + wdiff + offset,
                  -env.pos.y * scale + hdiff + offset);
    ctx.scale(scale, scale);
    drawShapeTo(shape, opts, env.tmat, ctx);
    ctx.restore();
  };

  const drawShapeTo = (shape, opts, tmat, ctx) => {
    let t = Matrix.idmat.slice();
    if(tmat) {
      t = Matrix.multmm(tmat, shape.finalTransform);
    }

    shape.paths.forEach(function(path) {
      art.Path.transform(path, t);
      art.Path.draw(path, ctx);
    });

    if(opts) {
      if(opts.fill !== "none") {
        ctx.fillStyle = opts.fill;
        ctx.fill("evenodd");
      }

      if(opts.stroke !== "none" && opts.weight > 0) {
        ctx.strokeStyle = opts.stroke;
        ctx.lineWidth = opts.weight * strokeWeightMod;
        ctx.stroke();
      }
    }
  };

  //TODO(adam): remove because only ever use 1 transfom
  art.Shape.addTransform = (shape, tmat) => {
    shape.transforms.push(tmat);
    art.Shape.calcFinalTransform(shape);

    shape.width = Math.round(shape.initWidth * shape.finalTransform[0]);
    shape.height = Math.round(shape.initHeight * shape.finalTransform[4]);

    shape.paths.forEach(path => art.Path.transform(path, shape.finalTransform));
  };

  art.Shape.calcFinalTransform = shape => {
    let tmat = Matrix.idmat.slice();
    shape.transforms.forEach(trans => tmat = Matrix.multmm(tmat, trans));
    shape.finalTransform = tmat;
  };

  art.Shape.shapeContainsPoint = (shape, tmat, pos) => {
    //NOTE(adam): build shape with no fill or stroke
    art.Shape.drawShape(shape, null, tmat);
    return art.ctx.isPointInPath(pos.x, pos.y);
  };

  return art;
}(Art || {}));
