angular.module("ushirt")
  .controller("navCtrl", function(usersFactory, $sce, $uibModal) {
    const nav = this;
    nav.user = usersFactory.currentUser;

    nav.enter = () => $uibModal.open({
      templateUrl: "app/auth/auth-modal.html",
      controller: "authModalCtrl",
      controllerAs: "auth"
    });
  });
