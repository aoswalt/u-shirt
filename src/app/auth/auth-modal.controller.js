angular.module("ushirt")
  .controller("authModalCtrl", function(authFactory, $uibModalInstance) {
    const auth = this;

    auth.user = {};

    auth.register = () => authFactory.register(auth.user.email, auth.user.password)
      .then(() => $uibModalInstance.close())
      .catch(err => auth.message = err.message);
    auth.login = () => authFactory.login(auth.user.email, auth.user.password)
      .then(() => $uibModalInstance.close())
      .catch(err => auth.message = err.message);
  });
