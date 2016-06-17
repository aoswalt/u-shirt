angular.module("ushirt")
  .controller("layersPanelCtrl", function(layersFactory) {
    const layers = this;
    layers.list = layersFactory.list;
    layers.selectLayer = layersFactory.selectLayer;
    layers.moveUp = () => layers.list = layersFactory.moveSelectedLayer(-1);
    layers.moveDown = () => layers.list = layersFactory.moveSelectedLayer(1);
  });
