angular.module("ushirt")
  .controller("layersPanelCtrl", function(layersFactory) {
    const layers = this;
    layers.list = layersFactory.list;
    layers.selectLayer = layersFactory.selectLayer;
  });
