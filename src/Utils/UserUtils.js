import firebase from './FireBase';

const getAllUsers = async () => {

  try {
   let permissionsList = await firebase.firestore().collection("permissionsList").get();
    let users = await firebase.firestore().collection("users").get();

    let userList = [];
    permissionsList.forEach((permissions, index) => {
      users.forEach((user, index) => {
        if (user.id === permissions.data().userId) {
          user["userData"] = user.data();
          user["permissions"] = permissions.data().permissions;
          user["userName"] = permissions.data().userName;
          userList.push(user);
        }
      });
    });
    return { isSuccess: true, users: userList };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}

const deleteUser = async (userId) => {
  try {
    let user = await firebase.firestore().collection("users").doc(userId);
    user.delete();

    await firebase.firestore().collection("permissionsList").where("userId", "==", userId).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          let permissionsObj = await firebase.firestore().collection("permissionsList").doc(doc.id);
          permissionsObj.delete();
        });
      })
      .catch(function (error) {
        throw error;
      });

    // TODO delete from logins - not possible for that moment
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const getUserById = async (userId) => {
  try {
    let userData = await firebase.firestore().collection("users").doc(userId).get();
    let permissionsList = await firebase.firestore().collection("permissionsList").get();

    let user = {};
    permissionsList.forEach((permissions, index) => {
      if (userData.id === permissions.data().userId) {
        user["userData"] = userData.data();
        user["permissions"] = permissions.data().permissions;
        user["userName"] = permissions.data().userName;
      }
    });

    return { isSuccess: true, user: user };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const updateUser = async (editUser) => {
  try {
    await firebase.firestore().collection("users").doc(editUser.id).update({
      firstName: editUser.firstName,
      lastName: editUser.lastName,
      createdDate: editUser.createdDate,
      sessionTimeout: editUser.sessionTimeout,
    });

    let permissoinId = "";
    await firebase.firestore().collection("permissionsList").where("userId", "==", editUser.id).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          permissoinId = doc.id;
        });
      })
      .catch(function (error) {
        throw error;
      });

    await firebase.firestore().collection("permissionsList").doc(permissoinId).update({
      userName: editUser.userName,
      permissions: editUser.permissions,
    });

    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }

}

const addUser = async (addUser, addPermissions, loginUser) => {
  try {
     let authData = await firebase.auth().createUserWithEmailAndPassword(loginUser.userName, "1qaz1qaz");

    let userData = await firebase.firestore().collection("users").add({
      logInId: authData.user.uid,
      firstName: addUser.firstName,
      lastName: addUser.lastName,
      createdDate: addUser.createdDate,
      sessionTimeout: addUser.sessionTimeout
    });

    await firebase.firestore().collection("permissionsList").add({
      userId: userData.id,
      userName: loginUser.userName,
      permissions: addPermissions.permissions
    });
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const isUserNameExist = async (userName) => {
  try {
     let authData = await firebase.auth().fetchSignInMethodsForEmail(userName);
    if (authData.length == 0) {
      return false;
    }
    else {
      return true;
    }

  }
  catch (e) {
    return false;
  }
}

export default {getAllUsers, deleteUser, getUserById, updateUser, addUser, isUserNameExist};