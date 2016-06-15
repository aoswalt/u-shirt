angular.module("ushirt")
  .factory("shapeDataFactory", ($http) => {
    return {
      loadShapes: res =>
        $http.get("data/shapes.json")
          .then(data => res(data), console.error)
    };
  });
