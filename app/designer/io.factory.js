angular.module("ushirt")
  .factory("ioFactory", (usersFactory, layersFactory, $timeout) => {
    const designsRef = firebase.database().ref("designs");

    const saveDesign = () => {
      const designData = layersFactory.serializeDesign();
      designData.uid = usersFactory.currentUser.uid;
      designsRef.child(designsRef.push().key).update(designData);
    };

    const fetchDesigns = () => $timeout()
      .then(() => designsRef.once("value"))
      .then(snapshot => snapshot.val())
      .then(data => Object.keys(data).map(key => data[key]))
      .then(data => data.filter(d => d.uid === usersFactory.currentUser.uid));

    return {
      saveDesign,
      fetchDesigns
    };
  });
