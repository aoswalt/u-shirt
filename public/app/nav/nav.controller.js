angular.module("ushirt")
  .controller("navCtrl", function(usersFactory, ioFactory, $sce, $uibModal, $location) {
    const nav = this;
    nav.user = usersFactory.currentUser;

    nav.enter = () => $uibModal.open({
      templateUrl: "app/auth/auth-modal.html",
      controller: "authModalCtrl",
      controllerAs: "auth"
    });


    nav.save = ioFactory.saveDesign;
    nav.browse = () => $location.path("/browse");
  });
