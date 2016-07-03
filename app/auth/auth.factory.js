angular.module("ushirt")
  .factory("authFactory", (usersFactory, $timeout) => {
    const currentUser = {};

    const setUser = (user) => Object.assign(currentUser, user);

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        usersFactory.getUserData(user.uid).then(data => setUser(data));
      } else {
        $timeout().then(() => setUser({uid:"", email:"", name:"Log In"}));
      }
    });

    return {
      user: currentUser,
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
