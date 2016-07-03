angular.module("ushirt")
  .factory("usersFactory", ($timeout) => {
    const currentUser = {};

    const usersRef = firebase.database().ref("users");

    const setCurrentUser = (user) => getUserData(user.uid)
      .then(data => Object.assign(currentUser, data));

    const clearCurrentUser = () => $timeout().then(() =>
      Object.assign(currentUser, {uid:"", email:"", name:""}));

    const getUserData = (uid) => $timeout()
      .catch(err => console.error(err))
      .then(() => usersRef.child(uid).once("value"))
      .then(snapshot => snapshot.val());

    const createUser = (user) => $timeout()
      .catch(err => console.error(err))
      .then(() => usersRef.child(user.uid).set(user));

    const setUserData = (user) => $timeout()
      .catch(err => console.error(err))
      .then(() => usersRef.child(user.uid).set(user));
      

    return {
      currentUser,
      setCurrentUser,
      clearCurrentUser,
      createUser
    };
  });
