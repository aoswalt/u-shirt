/* global Vec, Matrix */
var Art = (function(art) {  // eslint-disable-line no-var
  const nodeSize = 40;
  const fillStyle = "grey";
  const strokeStyle = "grey";
  const lineWeight = 6;

  art.Envelope = function(shape) {
    this.width = shape.width;
    this.height = shape.height;
    this.pos = new Vec(0, 0);
    this.extent = new Vec(this.width, this.height);
    this.startNodes = [
      new Vec(0, 0),
      new Vec(this.width, 0),
      new Vec(this.width, this.height),
      new Vec(0, this.height)
    ];
    this.nodes = [
      new Vec(0, 0),
      new Vec(this.width, 0),
      new Vec(this.width, this.height),
      new Vec(0, this.height)
    ];
    this.basisMapA = Matrix.makeBasisMap(this.startNodes);
    this.Ainverse = Matrix.invert(this.basisMapA);
    this.tmat = Matrix.idmat.slice();
  };

  /* eslint-disable no-magic-numbers */
  art.Envelope.setNodes = (env, nodeList) => {
    env.nodes = [
      new Vec(nodeList[0].x, nodeList[0].y),
      new Vec(nodeList[1].x, nodeList[1].y),
      new Vec(nodeList[2].x, nodeList[2].y),
      new Vec(nodeList[3].x, nodeList[3].y)
    ];
  };
  /* eslint-enable no-magic-numbers */

  art.Envelope.calcTmat = (env) => {
    env.tmat = Matrix.multmm(Matrix.makeBasisMap(env.nodes), env.Ainverse);

    //NOTE(adam): update properties from new node positions
    env.pos.x = env.nodes[0].x;
    env.pos.y = env.nodes[0].y;
    env.extent.x = env.nodes[0].x;
    env.extent.y = env.nodes[0].y;
    env.nodes.forEach(n => {
      env.pos.x = Math.min(n.x, env.pos.x);
      env.pos.y = Math.min(n.y, env.pos.y);
      env.extent.x = Math.max(n.x, env.extent.x);
      env.extent.y = Math.max(n.y, env.extent.y);
    });
    env.width = env.extent.x - env.pos.x;
    env.height = env.extent.y - env.pos.y;
  };

  /* eslint-disable no-magic-numbers */
  art.Envelope.drawEnvelope = (env) => {
    art.ctx.beginPath();
    art.ctx.moveTo(env.nodes[0].x, env.nodes[0].y);
    art.ctx.lineTo(env.nodes[1].x, env.nodes[1].y);
    art.ctx.lineTo(env.nodes[2].x, env.nodes[2].y);
    art.ctx.lineTo(env.nodes[3].x, env.nodes[3].y);
    art.ctx.closePath();
    art.ctx.strokeStyle = strokeStyle;
    art.ctx.lineWidth = lineWeight;
    art.ctx.stroke();

    art.ctx.fillStyle = fillStyle;
    art.ctx.fillRect(env.nodes[0].x - nodeSize / 2, env.nodes[0].y - nodeSize / 2,
                     nodeSize, nodeSize);
    art.ctx.fillRect(env.nodes[1].x - nodeSize / 2, env.nodes[1].y - nodeSize / 2,
                     nodeSize, nodeSize);
    art.ctx.fillRect(env.nodes[2].x - nodeSize / 2, env.nodes[2].y - nodeSize / 2,
                     nodeSize, nodeSize);
    art.ctx.fillRect(env.nodes[3].x - nodeSize / 2, env.nodes[3].y - nodeSize / 2,
                     nodeSize, nodeSize);
  };
  /* eslint-enable no-magic-numbers */

  art.Envelope.moveNode = (env, n, offset) => {
    //NOTE(adam): must work on node directly
    n.x += offset.x;
    n.y += offset.y;
    art.Envelope.calcTmat(env);
  };

  /* eslint-disable no-magic-numbers */
  art.Envelope.rotate = (env, deg) => {
    const mid = Vec.add(env.pos, Vec.scale(Vec.subtract(env.extent, env.pos), 0.5));
    const rad = deg * 3.14159 / 180;
    env.nodes.forEach(n => {
      const fromCenter = Vec.subtract(n, mid);
      n.x = mid.x + fromCenter.x * Math.cos(rad) - fromCenter.y * Math.sin(rad);
      n.y = mid.y + fromCenter.x * Math.sin(rad) + fromCenter.y * Math.cos(rad);
    });
    art.Envelope.calcTmat(env);
  };
  /* eslint-enable no-magic-numbers */

  art.Envelope.reset = (env) => {
    art.Envelope.setNodes(env, env.startNodes);
    art.Envelope.calcTmat(env);
  };

  return art;
}(Art || {}));
