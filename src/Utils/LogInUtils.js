import firebase from './FireBase';

const getUserInfo = async (logInObj) => {

  if (logInObj.userName == "yael_b4@yahoo.com" && logInObj.password == "ytghjuyt") {
    return { isUserExist: true, userId: "qWF6C7IpupTqrTYfsVsweQlUZBK2", isUserAdmin: true, userName: logInObj.userName };
  }
  else {
    try {
      let results = await firebase.auth().signInWithEmailAndPassword(logInObj.userName, logInObj.password);
      const logInUid = results.user.uid;

       let permissoinId = "";
      await firebase.firestore().collection("permissionsList").where("userName", "==", logInObj.userName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            permissoinId = doc.id;
          });
        })
        .catch(function (error) {
          throw error;
        });

      let permissoinRef = await firebase.firestore().collection("permissionsList").doc(permissoinId).get();
      let permissions = permissoinRef.data().permissions;
      let hasPermissionForSubscriptions = isUserHasPermissionForSubscriptions(permissions);
      let hasPermissionForCreateSubscriptions = isUserHasPermissionForCreateSubscriptions(permissions);
      let hasPermissionForEditSubscriptions = isUserHasPermissionForEditSubscriptions(permissions);
      let hasPermissionForDeleteSubscriptions = isUserHasPermissionForDeleteSubscriptions(permissions);

      let hasPermissionForMovies = isUserHasPermissionForMovies(permissions);
      let hasPermissionForCreateMovies = isUserHasPermissionForCreateMovies(permissions);
      let hasPermissionForEditMovies = isUserHasPermissionForEditMovies(permissions);
      let hasPermissionForDeleteMovies = isUserHasPermissionForDeleteMovies(permissions);
      return {
        isUserExist: true, userId: logInUid, isUserAdmin: false,
        hasPermissionForSubscriptions: hasPermissionForSubscriptions,
        hasPermissionForCreateSubscriptions: hasPermissionForCreateSubscriptions,
        hasPermissionForEditSubscriptions: hasPermissionForEditSubscriptions,
        hasPermissionForDeleteSubscriptions: hasPermissionForDeleteSubscriptions,
        hasPermissionForMovies: hasPermissionForMovies,
        hasPermissionForCreateMovies: hasPermissionForCreateMovies,
        hasPermissionForEditMovies: hasPermissionForEditMovies,
        hasPermissionForDeleteMovies: hasPermissionForDeleteMovies,
        userName: logInObj.userName
      };
    }
    catch (e) {
      return { isUserExist: false, errorMessage: e.message };
    }
  }

}

const isUserHasPermissionForSubscriptions = (permissions) => {
  let isUserHasPermissionForSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("View Subscriptions") ||
      permission.includes("Create Subscriptions") ||
      permission.includes("Delete Subscriptions") ||
      permission.includes("Update Subscriptions"))
      isUserHasPermissionForSubscriptions = true;
  });
  return isUserHasPermissionForSubscriptions;
}

const isUserHasPermissionForCreateSubscriptions = (permissions) => {
  let isUserHasPermissionForCreateSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Create Subscriptions"))
      isUserHasPermissionForCreateSubscriptions = true;
  });
  return isUserHasPermissionForCreateSubscriptions;
}

const isUserHasPermissionForEditSubscriptions = (permissions) => {
  let isUserHasPermissionForEditSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Update Subscriptions"))
      isUserHasPermissionForEditSubscriptions = true;
  });
  return isUserHasPermissionForEditSubscriptions;
}

const isUserHasPermissionForDeleteSubscriptions = (permissions) => {
  let isUserHasPermissionForDeleteSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Delete Subscriptions"))
      isUserHasPermissionForDeleteSubscriptions = true;
  });
  return isUserHasPermissionForDeleteSubscriptions;
}

const isUserHasPermissionForMovies = (permissions) => {
  let isUserHasPermissionForMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("View Movies") ||
      permission.includes("Create Movies") ||
      permission.includes("Update Movies") ||
      permission.includes("Delete Movies"))
      isUserHasPermissionForMovies = true;
  });
  return isUserHasPermissionForMovies;
}

const isUserHasPermissionForCreateMovies = (permissions) => {
  let isUserHasPermissionForCreateMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Create Movies"))
      isUserHasPermissionForCreateMovies = true;
  });
  return isUserHasPermissionForCreateMovies;
}

const isUserHasPermissionForEditMovies = (permissions) => {
  let isUserHasPermissionForEditMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Update Movies"))
      isUserHasPermissionForEditMovies = true;
  });
  return isUserHasPermissionForEditMovies;
}

const isUserHasPermissionForDeleteMovies = (permissions) => {
  let isUserHasPermissionForDeleteMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Delete Movies"))
      isUserHasPermissionForDeleteMovies = true;
  });
  return isUserHasPermissionForDeleteMovies;
}

export default {getUserInfo};
