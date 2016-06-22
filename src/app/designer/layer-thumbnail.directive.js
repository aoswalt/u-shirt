angular.module("ushirt")
  .directive("layerTumbnail", () => {
    const size = 100;

    return {
      restrict: "E",
      replace: true,
      scope: { layer: "=" },
      template:
        `<canvas class="thumb" width="${size}px" height="${size}px"></canvas>`,
      link: (scope, element) => {
        scope.layer.ctx = element[0].getContext("2d");
        Art.Shape.drawThumb(scope.layer.shape,
                            scope.layer.opts,
                            scope.layer.envelope,
                            scope.layer.ctx);
      }
    };
  });
