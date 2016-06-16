/* global Vec */
angular.module("ushirt")
  .directive("artboard", (svgParseFactory) => {
    const width = 1300;
    const height = 1500;

    let mousePoint = new Vec(0, 0);
    let prevPoint = new Vec(0, 0);
    let isDragging = false;
    const draggingNodes = [];
    const selectionArea = 30;


    const mousedown = e => {};
    const mouseup = e => {};
    const mouseout = e => {};
    const mousemove = e => {};

    return {
      restrict: "E",
      replace: true,
      template: `<canvas width="${width}px" height="${height}px"></canvas>`,
      link: (scope, element, attr) => {
        const canvas = element[0];
        // canvas.width = width;
        // canvas.height = height;
        const clientRect = canvas.getBoundingClientRect();
        const scale = Math.min(canvas.width / clientRect.width, canvas.height / clientRect.height);
        const ctx = canvas.getContext("2d");

        svgParseFactory.setup(canvas, ctx);

        element.css({
          display: "block",
          "margin-right": "auto",
          "margin-left": "auto"
        });

        element.on("mousedown", mousedown);
        element.on("mouseup", mouseup);
        element.on("mouseout", mouseout);
        element.on("mousemove", mousemove);
      }
    };
  });
