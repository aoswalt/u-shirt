angular.module("ushirt")
  .factory("authFactory", ($timeout, $sce) => {
    const user = {
      name: $sce.trustAsHtml(`Log In <span class="glyphicon glyphicon-user"></span>`)
    };

    const setName = (name) => user.name = $sce.trustAsHtml(`${name} <span></span>`);

    return {
      user,
      register: (email, password) => $timeout()
        .then(() => firebase.auth().createUserWithEmailAndPassword(email, password)
          .catch(err => console.error(err))
          .then(usr => Object.assign(user, usr))
          .then(() => setName("Registered"))),
      login: (email, password) => $timeout()
        .then(() => firebase.auth().signInWithEmailAndPassword(email, password)
          .catch(err => console.error(err))
          .then(usr => Object.assign(user, usr))
          .then(() => setName("Logged")))
    };
  });
