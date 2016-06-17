angular.module("ushirt")
  .directive("layersPanel", () => {
    const layerList = [];
    let selectedLayer = null;

    function Envelope(shape) {
      this.shape = shape;
    }

    function Layer(shape) {
      this.shape = shape;
      this.envelope = new Envelope(shape);
    }

    const selectLayer = layer => {
      if(layer.selected) {
        layer.selected = false;
        selectedLayer = null;
      } else {
        layerList.forEach(l => l.selected = false);
        selectedLayer = layer;
        selectedLayer.selected = true;
      }
    };

    layerList.push(new Layer(null));
    layerList.push(new Layer(null));
    layerList.push(new Layer(null));
    layerList.push(new Layer(null));

    selectLayer(layerList[1]);

    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/designer/designer-layers.html",
      link: (scope) => {
        scope.layers = { layerList, selectLayer };
      }
    };
  });
