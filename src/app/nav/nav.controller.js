angular.module("ushirt")
  .controller("navCtrl", function(usersFactory, ioFactory, authFactory, $sce, $uibModal, $location) {
    //NOTE(adam): inclucding authFactory to trigger auto-login
    const nav = this;
    nav.user = usersFactory.currentUser;

    nav.showInfo = () => $uibModal.open({
      templateUrl: "app/info/info-modal.html"
    });

    nav.enter = () => $uibModal.open({
      templateUrl: "app/auth/auth-modal.html",
      controller: "authModalCtrl",
      controllerAs: "auth"
    });


    nav.save = ioFactory.saveDesign;
    nav.browse = () => $location.path("/browse");
  });
