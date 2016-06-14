angular.module("ushirt")
  .config($routeProvider =>
    $routeProvider
      .when("/", {
        controller: "designCtrl",
        controllerAs: "design",
        templateUrl: "app/designer/designer.html",
        title: "U-Shirt! - Designer"
      })
  );
