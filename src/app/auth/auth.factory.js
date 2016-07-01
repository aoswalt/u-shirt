angular.module("ushirt")
  .factory("authFactory", (usersFactory, $timeout, $sce) => {
    const currentUser = {
      name: $sce.trustAsHtml(`Log In <span class="glyphicon glyphicon-user"></span>`)
    };

    const setName = (name) => currentUser.name = $sce.trustAsHtml(`${name} <span></span>`);

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        usersFactory.getUserData(user.uid).then(data => setName(data.name));
      } else {
        setName("None");
      }
    });

    return {
      user: currentUser,
      register: (email, password) => $timeout()
        .catch(err => console.error(err))
        .then(() => firebase.auth().createUserWithEmailAndPassword(email, password))
        .then((user) => ({
          uid: user.uid,
          email: user.email,
          name: user.email.match(/(.+)@.+/)[1]
        }))
        .then(user => usersFactory.createUser(user)),
      login: (email, password) => $timeout()
        .catch(err => console.error(err))
        .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
    };
  });
