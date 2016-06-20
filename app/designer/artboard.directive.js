/* global Vec */
angular.module("ushirt")
  .directive("artboard", (layersFactory) => {
    const width = 1300;
    const height = 1500;

    let clientRect = null;
    let scale = 0;

    let mousePoint = new Vec(0, 0);
    let prevPoint = new Vec(0, 0);
    let isDragging = false;
    let draggingNodes = [];
    const selectionArea = 30;


    const updateMousePoint = (e) => {
      prevPoint = new Vec(mousePoint.x, mousePoint.y);
      mousePoint = new Vec(Math.round(e.x - clientRect.left) * scale,
                           Math.round(e.y - clientRect.top) * scale);
    };

    const mousedown = (e) => {
      isDragging = true;
      draggingNodes = [layersFactory.getSelectedLayer().envelope.nodes[1],
                       layersFactory.getSelectedLayer().envelope.nodes[2]];
      updateMousePoint(e);
    };

    const mousefree = (e) => {
      updateMousePoint(e);
      isDragging = false;
    };

    const mousemove = (e) => {
      updateMousePoint(e);
      if(isDragging) {
        const env = layersFactory.getSelectedLayer().envelope;
        draggingNodes.forEach((n) => {
          const offset = Vec.subtract(mousePoint, prevPoint);
          Art.Envelope.moveNode(env, n, offset);
        });
        layersFactory.drawList();
      }
    };

    return {
      restrict: "E",
      replace: true,
      template: `<canvas width="${width}px" height="${height}px"></canvas>`,
      link: (scope, element) => {
        const canvas = element[0];
        // canvas.width = width;
        // canvas.height = height;
        clientRect = canvas.getBoundingClientRect();
        scale = Math.min(canvas.width / clientRect.width, canvas.height / clientRect.height);
        const ctx = canvas.getContext("2d");

        Art.setContext(ctx);

        element.css({
          display: "block",
          "margin-right": "auto",
          "margin-left": "auto"
        });

        element.on("mousedown", mousedown);
        element.on("mouseup", mousefree);
        element.on("mouseout", mousefree);
        element.on("mousemove", mousemove);
      }
    };
  });
