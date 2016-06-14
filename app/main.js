angular.module("ushirt", ["ui.bootstrap"])
  //TODO(adam): set page title based on view routing
  .controller("navCtrl", function() {

  })

  .controller("designCtrl", function() {
    const design = this;
    design.isCollapsed = true;
  });
