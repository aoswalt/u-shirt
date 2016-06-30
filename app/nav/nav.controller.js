angular.module("ushirt")
  .controller("navCtrl", function(authFactory, $sce, $uibModal) {
    const nav = this;
    nav.user = authFactory.user;

    nav.enter = () => $uibModal.open({
      templateUrl: "app/auth/auth-modal.html",
      size: "lg",
      controller: "authModalCtrl",
      controllerAs: "auth"
    });
  });
