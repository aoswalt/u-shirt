angular.module("ushirt")
  .filter("title", () => (input) =>
    input.replace(/-/g, " ").replace(/\b\w/g, match => match.toUpperCase())
  );
