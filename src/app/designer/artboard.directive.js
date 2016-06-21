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
    const selectionArea = 50;


    const updateMousePoint = (e) => {
      prevPoint = new Vec(mousePoint.x, mousePoint.y);
      mousePoint = new Vec(Math.round(e.x - clientRect.left) * scale,
                           Math.round(e.y - clientRect.top) * scale);
    };

    const mousedown = (e) => {
      updateMousePoint(e);
      let activeLayer = layersFactory.getSelectedLayer();

      if(!activeLayer) {
        activeLayer = layersFactory.selectLayerAtPoint(mousePoint);
        if(activeLayer) {
          isDragging = true;
          draggingNodes = activeLayer.envelope.nodes.slice();
          return;
        }
      } else {
        const env = activeLayer.envelope;

        /* eslint-disable no-magic-numbers */
        //NOTE(adam): node selection
        if(Vec.distance(mousePoint, env.nodes[0]) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[0]];
          return;
        } else if(Vec.distance(mousePoint, env.nodes[1]) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[1]];
          return;
        } else if(Vec.distance(mousePoint, env.nodes[2]) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[2]];
          return;
        } else if(Vec.distance(mousePoint, env.nodes[3]) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[3]];
          return;

          //NOTE(adam): line selection
        } else if(Vec.distanceToLine(env.nodes[0], env.nodes[1], mousePoint) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[0], env.nodes[1]];
          return;
        } else if(Vec.distanceToLine(env.nodes[1], env.nodes[2], mousePoint) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[1], env.nodes[2]];
          return;
        } else if(Vec.distanceToLine(env.nodes[2], env.nodes[3], mousePoint) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[2], env.nodes[3]];
          return;
        } else if(Vec.distanceToLine(env.nodes[3], env.nodes[0], mousePoint) <= selectionArea) {
          isDragging = true;
          draggingNodes = [env.nodes[3], env.nodes[0]];
          return;
          /* eslint-enable no-magic-numbers */

          //NOTE(adam): point insdie shape
        } else if(Art.Shape.shapeContainsPoint(activeLayer.shape, activeLayer.envelope.tmat, mousePoint)) {
          isDragging = true;
          draggingNodes = activeLayer.envelope.nodes.slice();
        } else {
          layersFactory.selectLayerAtPoint(mousePoint);
        }
      }
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
