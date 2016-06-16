/* global Matrix */
/* eslint-disable no-magic-numbers */

//NOTE(adam): shape operations
var Art = (function(art) {  // eslint-disable-line no-var
  art.Shape = function(width, height, paths) {
    this.initWidth = width;
    this.initHeight = height;
    this.width = width;
    this.height = height;
    this.paths = paths;

    this.transforms = [];
    this.finalTransform = Matrix.idmat.slice();
  };

  art.Shape.drawShape = (shape, opts, tmat) => {
    let t = Matrix.idmat.slice();
    if(tmat) {
      t = Matrix.multmm(tmat, shape.finalTransform);
    }

    shape.paths.forEach(function(path) {
      art.Path.transform(path, t);
      art.Path.draw(path);
    });

    if(opts) {
      art.ctx.fillStyle = opts.fillStyle;
      if(opts.fillStyle !== "none") {
        art.ctx.fill();
      }

      art.ctx.strokeStyle = opts.strokeStyle;
      art.ctx.lineWidth = opts.strokeWeight;
      if(opts.strokeStyle !== "none" && opts.strokeWeight !== 0) {
        art.ctx.stroke();
      }
    }
  };

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

  return art;
}(Art || {}));
