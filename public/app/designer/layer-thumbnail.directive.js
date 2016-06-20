angular.module("ushirt")
  .directive("layerTumbnail", () => {
    const size = 50;

    return {
      restrict: "E",
      replace: true,
      scope: { layer: "=" },
      template:
        `<canvas class="thumb" width="${size}px" height="${size}px"></canvas>`,
      link: (scope, element) => {
        scope.layer.ctx = element[0].getContext("2d");
        Art.drawThumb(scope.layer.shape, scope.layer.ctx);
      }
    };
  });
