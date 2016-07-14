angular.module("ushirt")
  .controller("profileCtrl", function(usersFactory, ioFactory, layersFactory, authFactory, $location) {
    const profile = this;
    profile.user = usersFactory.currentUser;
    ioFactory.fetchDesigns().then(designs => profile.designs = designs);

    profile.logOut = () => {
      authFactory.logOut();
      $location.path("/");
    };

    profile.loadDesign = (designData) => {
      layersFactory.deserializeDesign(designData);
      $location.path("/");
    };
  });
