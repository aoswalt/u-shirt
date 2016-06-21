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
    //NOTE(adam): using object reference to handle stroke weight updating
    //TODO(adam): initial setting for weight to populate select
    design.style = settingsFactory.getStyle();
    design.setStrokeWeight = () => {
      // settingsFactory.setStrokeWeight(design.strokeWeight);
      layersFactory.updateSelectedOpts({weight: design.style.weight});
    };

    design.addShape = layersFactory.addLayer;

    const rotDeg = 15;
    design.rotateCW = () => layersFactory.rotateSelectedLayerEnvelope(rotDeg);
    design.rotateCCW = () => layersFactory.rotateSelectedLayerEnvelope(-rotDeg);

    design.resetTransform = layersFactory.resetSelectedLayer;
  });
