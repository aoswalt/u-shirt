angular.module("ushirt")
  .controller("designCtrl", function(settingsFactory, shapeDataFactory, layersFactory) {
    const design = this;
    shapeDataFactory.loadShapes(response => design.shapeData = response.data);

    design.shirtColors = settingsFactory.shirtColorList;
    design.shirtColor = design.shirtColors[0];
    design.fillColors = settingsFactory.fillColorList;
    design.strokeColors = settingsFactory.strokeColorList;


    design.addShape = layersFactory.addLayer;

    design.setShirtColor = color => {
      design.shirtColor = color;
      settingsFactory.setShirtColor(color);
    };

    design.setFillColor = color => {
      settingsFactory.setFillColor(color);
      design.fillColors.forEach(c => c.selected = false);
      color.selected = true;
    };

    design.setStrokeColor = color => {
      settingsFactory.setStrokeColor(color);
      design.strokeColors.forEach(c => c.selected = false);
      color.selected = true;
    };

    design.setStrokeWeight = settingsFactory.setStrokeWeight;
  });
