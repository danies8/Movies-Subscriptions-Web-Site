import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import EditUser from '../UserManagement/EditUser';
import userUtils from '../../../Utils/UserUtils.js';
import User from './User';
import common from '../../../Utils/Common.js';

function AllUsers(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const history = useHistory();
 

  useEffect(() => {
    async function getAllUsers() {
        let results = await userUtils.getAllUsers();
        if (results.isSuccess) {
            setUsers(results.users)
        }
        else{
          setErrorMessage(results.errorMessage);
        }
     }
    getAllUsers();
  }, []);


  const onUserClickOnEdit = (userId) => {
    setUsers([]);
    history.push(`${common.editUserWithId}/${userId}`);
  }

  const onUserClickOnDelete = (userId) => {
    let child = document.getElementById (userId);
    let parent =document.getElementById('divUsers');
    parent.removeChild(child);
  }

  return (
    <div id="divUsers">
      {
        users.map((user, key) => {
          return user.userName !== common.adminUserName ?  <div id={user.id}> <User  key={user.id} user={user}
            onUserClickOnEditCallback={(userId) => { onUserClickOnEdit(userId) }}
            onUserClickOnDeleteCallback={(userId) => { onUserClickOnDelete(userId) }} />
            </div> :""
        })}
      {errorMessage}

      <Switch>
        <Route path={common.reload} component={null} key="reload" />
        <Route path={`${common.editUser}`} component={EditUser} />
      </Switch>
    </div>
  );
}
export default AllUsers;
