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

firebase.initializeApp({
  apiKey: "AIzaSyAg5lzLVSDFdUr2WJokUC-CJ94C0FUA0pE",
  authDomain: "u-shirt.firebaseapp.com",
  databaseURL: "https://u-shirt.firebaseio.com",
  storageBucket: "u-shirt.appspot.com"
});
