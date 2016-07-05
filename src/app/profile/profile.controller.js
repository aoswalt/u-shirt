angular.module("ushirt")
  .controller("profileCtrl", function(usersFactory, ioFactory, layersFactory, $location) {
    const profile = this;
    profile.user = usersFactory.currentUser;
    ioFactory.fetchDesigns().then(designs => profile.designs = designs);

    profile.loadDesign = (designData) => {
      layersFactory.deserializeDesign(designData);
      $location.path("/");
    };
  });
