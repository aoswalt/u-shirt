angular.module("ushirt")
  .controller("profileCtrl", function(usersFactory, ioFactory) {
    const profile = this;
    profile.user = usersFactory.currentUser;
    ioFactory.fetchDesigns().then(designs => profile.designs = designs);
  });
