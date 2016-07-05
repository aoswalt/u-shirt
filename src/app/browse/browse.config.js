angular.module("ushirt")
  .config($routeProvider =>
    $routeProvider
      .when("/browse", {
        controller: "browseCtrl",
        controllerAs: "browse",
        templateUrl: "app/browse/browse.html",
        title: "U-Shirt! - Browse Designs"
      })
  );
