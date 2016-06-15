angular.module("ushirt")
  .controller("designCtrl", function(colorFactory, shapeDataFactory, $timeout) {
    const design = this;
    shapeDataFactory.loadShapes(response => $timeout(design.shapeData = response.data));

    design.shirtColorList = colorFactory.getShirtColorList();
    design.printColorList = colorFactory.getPrintColorList();

    design.shirtColor = design.shirtColorList[0];
    design.style = {
      fill: Object.assign({}, design.printColorList[0]),
      outline: Object.assign({}, design.printColorList[0]),
      weight: 0
    };

    design.addShape = console.log;


    design.setShirtColor = color => {
      design.shirtColor = color;
      console.log("design.shirtColor", design.shirtColor);
    };

    design.setFillColor = color => {
      Object.assign(design.style.fill, color);
      console.log("design.style", design.style);
    };

    design.setOutlineColor = color => {
      Object.assign(design.style.outline, color);
      console.log("design.style", design.style);
    };

  });
