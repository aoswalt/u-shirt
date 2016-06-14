angular.module("ushirt", ["ngRoute", "ui.bootstrap"])
  .config($routeProvider =>
    $routeProvider
      .when("/", {
        controller: "designCtrl",
        controllerAs: "design",
        templateUrl: "app/designer/designer.html"
      })
      .otherwise("/")
    )
  //TODO(adam): set page title based on view routing


  .controller("navCtrl", function() {

  });
