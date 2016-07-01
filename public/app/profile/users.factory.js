angular.module("ushirt")
  .factory("usersFactory", ($timeout) => {
    const usersRef = firebase.database().ref("users");

    return {
      getUserData: (uid) => $timeout()
        .then(() => usersRef.child(uid).once("value"))
        .catch(err => console.error(err))
        .then(snapshot => snapshot.val()),
      setUserData: (user) => $timeout()
        .then(() => usersRef.child(user.uid).set(user))
        .catch(err => console.error(err))
    };
  });
