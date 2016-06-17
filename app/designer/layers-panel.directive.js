angular.module("ushirt")
  .directive("layersPanel", (layersFactory) => {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/designer/designer-layers.html",
      link: (scope) => {
        scope.layers = {
          layerList: layersFactory.list,
          selectLayer: layersFactory.selectLayer
        };
      }
    };
  });
