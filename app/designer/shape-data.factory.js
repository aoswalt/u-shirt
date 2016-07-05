angular.module("ushirt")
  .factory("shapeDataFactory", ($http, $timeout) => {
    let shapeData = null;

    return {
      loadShapes: () => {
        if(shapeData) {
          return $timeout().then(() => shapeData);
        } else {
          return $http.get("data/shapes.json")
            .then(response => shapeData = response.data)
            .catch(err => console.error(err));
        }
      },
      getShapeData: (shapeId) => {
        let shapes = [];
        shapeData.groups.forEach(g => shapes = shapes.concat(g.shapes));
        return shapes.find(s => s.id === shapeId);
      }
    };
  });
