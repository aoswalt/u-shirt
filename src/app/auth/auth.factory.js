angular.module("ushirt")
  .factory("authFactory", (usersFactory, $timeout) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        usersFactory.setCurrentUser(user);
      } else {
        usersFactory.clearCurrentUser();
      }
    });

    return {
      register: (email, password) => $timeout()
        .then(() => firebase.auth().createUserWithEmailAndPassword(email, password))
        .then((user) => ({
          uid: user.uid,
          email: user.email,
          name: user.email.match(/(.+)@.+/)[1]
        }))
        .then(user => usersFactory.createUser(user)),
      login: (email, password) => $timeout()
        .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
    };
  });
