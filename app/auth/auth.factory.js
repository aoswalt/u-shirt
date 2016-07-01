angular.module("ushirt")
  .factory("authFactory", (usersFactory, $timeout, $sce) => {
    const user = {
      name: $sce.trustAsHtml(`Log In <span class="glyphicon glyphicon-user"></span>`)
    };

    const setName = (name) => user.name = $sce.trustAsHtml(`${name} <span></span>`);

    firebase.auth().onAuthStateChanged((usr) => {
      if(usr) {
        usersFactory.getUserData(usr.uid).then(data => setName(data.name));
      }
    });

    return {
      user,
      register: (email, password) => $timeout()
        .catch(err => console.error(err))
        .then(() => firebase.auth().createUserWithEmailAndPassword(email, password)),
      login: (email, password) => $timeout()
        .catch(err => console.error(err))
        .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
    };
  });
