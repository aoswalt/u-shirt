/* global Matrix */
//NOTE(adam): vector math
function Vec(x, y) {
  this.x = x;
  this.y = y;
}
Vec.lengthSq = (v) => (v.x * v.x * v.y * v.y);
Vec.length = (v) => Math.sqrt(Vec.lengthSq(v));
Vec.add = (a, b) => new Vec(a.x + b.x, a.y + b.y);
Vec.subtract = (a, b) => new Vec(a.x - b.x, a.y - b.y);
Vec.scale = (v, s) => new Vec(v.x * s, v.y * s);
Vec.distanceSq = (a, b) => ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
Vec.distance = (a, b) => Math.sqrt(Vec.distanceSq(a, b));
Vec.unit = (v) => Vec.scale(v, 1 / length(v));
Vec.dot = (a,b) => (a.x * b.x + a.y * b.y);
Vec.transform = (v, tmat) => {
  const map = Matrix.multmv(tmat, [v.x, v.y, 1]);
  return new Vec(
    Math.round(map[0] / map[2]),
    Math.round(map[1] / map[2])
  );
};
