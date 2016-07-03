angular.module("ushirt")
  .config($routeProvider =>
    $routeProvider
      .when("/profile", {
        controller: "profileCtrl",
        controllerAs: "profile",
        templateUrl: "app/profile/profile.html",
        title: "U-Shirt! - User Profile"
      })
  );
