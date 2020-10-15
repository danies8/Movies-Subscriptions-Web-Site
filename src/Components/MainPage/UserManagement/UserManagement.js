import React, { useEffect } from 'react';
import { Route, Switch, useHistory , NavLink} from 'react-router-dom';
import {Typography, makeStyles} from '@material-ui/core';

import AllUsers from './AllUsers';
import AddUser from './AddUser';
import EditUser from './EditUser';
import './UserManagement.css';
import common from '../../../Utils/Common';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
          },
    },
}));

function UserManagement(props) {
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        function loadAllUsersFirstTime() {
            history.push(common.allUsers);
        }
        loadAllUsersFirstTime();
    }, []);

    return (
        <div className="userManagementBorderStyle">
            <h3>Users</h3>
            <Typography className={classes.root}>
                <NavLink to={`${common.allUsers}`} activeStyle={{ backgroundColor: common.menuColor }}>All Users</NavLink>
                 <NavLink to={`${common.addUser}`} activeStyle={{ backgroundColor: common.menuColor }}>Add User</NavLink>
            </Typography >
            <Switch>
                <Route path={common.reload} component={null} key="reload" />
                <Route path={`${common.allUsers}`} component={AllUsers} />
                <Route path={`${common.addUser}`} component={AddUser} />
                <Route path={`${common.editUser}`} component={EditUser} />
            </Switch>
        </div>
    );
}
export default UserManagement;
