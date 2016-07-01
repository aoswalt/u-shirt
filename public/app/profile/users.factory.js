angular.module("ushirt")
  .factory("usersFactory", ($timeout) => {
    const usersRef = firebase.database().ref("users");

    return {
      getUserData: (uid) => $timeout()
        .catch(err => console.error(err))
        .then(() => usersRef.child(uid).once("value"))
        .then(snapshot => snapshot.val()),
      createUser: (user) => $timeout()
        .catch(err => console.error(err))
        .then(() => usersRef.child(user.uid).set(user)),
      setUserData: (user) => $timeout()
        .catch(err => console.error(err))
        .then(() => usersRef.child(user.uid).set(user))
    };
  });
