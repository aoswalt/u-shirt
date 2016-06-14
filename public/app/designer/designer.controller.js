angular.module("ushirt")
  .controller("designCtrl", function(colorFactory) {
    const design = this;

    design.shirtColorList = colorFactory.getShirtColorList();
    design.shirtColor = design.shirtColorList[0];
    design.printColorList = colorFactory.getPrintColorList();

    design.isCollapsed = true;
  });
