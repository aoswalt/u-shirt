angular.module("ushirt")
  .controller("profileCtrl", function(usersFactory) {
    const profile = this;
    profile.user = usersFactory.currentUser;
  });
