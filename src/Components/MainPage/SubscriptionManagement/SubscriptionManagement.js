import React, { useContext, useEffect } from 'react';
import { NavLink, Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import {Typography,makeStyles} from '@material-ui/core';

import AllMembers from './AllMembers';
import AddMember from './AddMember';
import './SubscriptionManagement.css';
import { AppContext } from '../../../AppContext';
import common from '../../../Utils/Common';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

function SubscriptionManagement(props) {
    const classes = useStyles();

    const { isUserAdmin, hasPermissionForCreateSubscriptions } = useContext(AppContext);
    const [stateIsUserAdmin] = isUserAdmin;
    const [stateHasPermissionForCreateSubscriptions] = hasPermissionForCreateSubscriptions;
    const history = useHistory();

    useEffect(() => {
        function loadAllMembersFirstTime() {
            history.push(common.allMembers);
        }
        loadAllMembersFirstTime();
    }, []);

    return (
        <div className="subscriptionManagementBorderStyle">

            <h4>Subscription</h4>

            <Typography className={classes.root}>
                <NavLink to={`${common.allMembers}`} activeStyle={{ backgroundColor: common.menuColor }}>All Members</NavLink>
                {
                    stateIsUserAdmin || stateHasPermissionForCreateSubscriptions ?
                        <NavLink to={`${common.addMember}`} activeStyle={{ backgroundColor: common.menuColor }}>Add Member</NavLink>
                        : ""
                }

            </Typography >

            <Switch>
                <Route path={common.reload} component={null} key="reload" />
                <Route exact path={`${common.allMembersWithId}`} component={AllMembers} />
                <Route path={`${common.allMembers}`} component={AllMembers} />
                <Route path={`${common.addMember}`} component={AddMember} />
            </Switch>
        </div>
    );
}
export default SubscriptionManagement;
