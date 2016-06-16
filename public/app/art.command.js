/* global Vec */
//NOTE(adam): command operations
var Art = (function(art) {  // eslint-disable-line no-var
  art.Command = function(name, args) {
    this.name = name;
    this.args = args;
    this.tArgs = args.slice();
  };

  art.Command.execute = (cmd) => {
    const applyArgs = [];
    cmd.tArgs.forEach(a => applyArgs.push(a.x, a.y));
    cmd.name.apply(art.ctx, applyArgs);
  };

  art.Command.transform = (cmd, tmat) =>
  cmd.tArgs = cmd.args.map(a => Vec.transform(a, tmat)).slice();

  return art;
}(Art || {}));
