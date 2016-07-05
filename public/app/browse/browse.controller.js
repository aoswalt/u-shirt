angular.module("ushirt")
  .controller("browseCtrl", function(ioFactory, layersFactory, $location) {
    const browse = this;
    ioFactory.fetchAllDesigns().then(designs => browse.designs = designs);

    browse.loadDesign = (designData) => {
      layersFactory.deserializeDesign(designData);
      $location.path("/");
    };
  });
