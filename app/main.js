angular.module("ushirt", ["ngRoute", "ui.bootstrap"])
  .config($routeProvider =>
    $routeProvider
      .otherwise("/")
  )

  //NOTE(adam): set page title based on view routing
  .run($rootScope =>
    $rootScope.$on("$routeChangeSuccess", (event, current, prev) =>
      $rootScope.title = current.$$route.title
  ));
