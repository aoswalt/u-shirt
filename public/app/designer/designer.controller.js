angular.module("ushirt")
  .controller("designCtrl", function(settingsFactory, shapeDataFactory, layersFactory) {
    const design = this;
    shapeDataFactory.loadShapes(response => design.shapeData = response.data);

    design.shirtColors = settingsFactory.shirtColorList;
    design.shirtColor = design.shirtColors[0];


    design.setShirtColor = color => {
      design.shirtColor = color;
      settingsFactory.setShirtColor(color);
    };

    design.fillColors = settingsFactory.fillColorList;
    design.strokeColors = settingsFactory.strokeColorList;
    design.setFillColor = (color) => {
      settingsFactory.setFillColor(color);
      layersFactory.updateSelectedOpts({fill: color});
    };
    design.setStrokeColor = (color) => {
      settingsFactory.setStrokeColor(color);
      layersFactory.updateSelectedOpts({stroke: color});
    };
    design.setStrokeWeight = settingsFactory.setStrokeWeight;

    design.addShape = layersFactory.addLayer;
  });
