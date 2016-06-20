//NOTE(adam): path operations
var Art = (function(art) {  // eslint-disable-line no-var
  art.Path = function(startPoint) {
    this.startPoint = startPoint;
    this.commands = [];
  };

  art.Path.addCommand = (path, commandName, args) => {
    path.commands.push(new art.Command(commandName, args));
    art.Path.drawLastCommand(path);   //NOTE(adam): for holes
  };

  art.Path.prependCommand = (path, commandName, args) => {
    path.commands.unshift(new art.Command(commandName, args));
    art.Path.drawLastCommand(path);   //NOTE(adam): for holes
  };

  art.Path.reverse = path => {
    const first = path.commands.shift();
    path.commands.reverse().unshift(first);
  };

  art.Path.draw = (path, ctx) =>
    path.commands.forEach(cmd => art.Command.execute(cmd, ctx));

  art.Path.drawLastCommand = (path) =>
  art.Command.execute(path.commands[path.commands.length - 1], art.ctx);

  art.Path.transform = (path, tmat) =>
  path.commands.map(cmd => art.Command.transform(cmd, tmat));

  return art;
}(Art || {}));
