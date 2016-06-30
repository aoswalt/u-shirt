angular.module("ushirt")
  .controller("authModalCtrl", function(authFactory, $uibModalInstance) {
    const auth = this;

    auth.register = () => authFactory.register();
    auth.login = () => authFactory.login("a@a.com", "123456");
  });
