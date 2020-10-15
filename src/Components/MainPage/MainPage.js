import React, { useContext } from 'react';
import { Route, Switch, useRouteMatch, NavLink , } from 'react-router-dom';
import {Typography,makeStyles, IconButton, Tooltip} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import PeopleIcon from '@material-ui/icons/People';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';

import MovieManagement from './MovieManagement/MovieManagement';
import SubscriptionManagement from './SubscriptionManagement/SubscriptionManagement';
import UserManagement from './UserManagement/UserManagement';
import './MainPage.css';
import LogIn from '../../Components/Login/LogInPage';
import { AppContext } from '../../AppContext';
import common from '../../Utils/Common';
import WelcomePage from './WelcomePage';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    fab: {
        margin: theme.spacing(2),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));

function MainPage(props) {
    const classes = useStyles();

    const { isUserAdmin, hasPermissionForSubscriptions, hasPermissionForMovies, loginUserName } = useContext(AppContext);
    const [stateIsUserAdmin] = isUserAdmin;
    const [stateHasPermissionForSubscriptions] = hasPermissionForSubscriptions;
    const [stateHasPermissionForMovies] = hasPermissionForMovies;
    const [staeteLoginUserName] = loginUserName;


    let match = useRouteMatch();
     return (
        <div >
            <Typography className={classes.root}>

                <NavLink to={`${common.welcomePage}`} activeStyle={{ backgroundColor: common.menuColor }}>
                    {<Tooltip title="Welcome Page">
                        <IconButton aria-label="Welcome Page">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>}
                </NavLink>

                {
                    stateIsUserAdmin || stateHasPermissionForMovies ?
                        <NavLink to={`${common.movieManagement}`} activeStyle={{ backgroundColor: common.menuColor }}>
                            {<Tooltip title="Movies">
                                <IconButton aria-label="Movies">
                                    <PersonalVideoIcon />
                                </IconButton>
                            </Tooltip>}
                        </NavLink> : ""
                }

                {
                    stateIsUserAdmin || stateHasPermissionForSubscriptions ?
                        <NavLink to={`${common.subscriptionManagement}`} activeStyle={{ backgroundColor: common.menuColor }}>
                            {<Tooltip title="Subscriptions">
                                <IconButton aria-label="Subscriptions">
                                    <SubscriptionsIcon />
                                </IconButton>
                            </Tooltip>}
                        </NavLink> : ""
                }

                {
                    stateIsUserAdmin ?
                        <NavLink to={`${common.userManagement}`} activeStyle={{ backgroundColor: common.menuColor }}>
                            {<Tooltip title="User Management">
                                <IconButton aria-label="User Management">
                                    <PeopleIcon />
                                </IconButton>
                            </Tooltip>}
                        </NavLink>
                        : ""
                }

                <NavLink to={common.login} >
                    {<Tooltip title="LogOut">
                        <IconButton aria-label="LogOut">
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>}
                </NavLink>
                <strong>{staeteLoginUserName}</strong>
            </Typography >
            <Switch>
                <Route path={`${common.welcomePage}`} component={WelcomePage} />
                <Route path={`${common.movieManagement}`} component={MovieManagement} />
                <Route path={`${common.subscriptionManagement}`} component={SubscriptionManagement} />
                <Route path={`${common.userManagement}`} component={UserManagement} />
                <Route path="/" component={LogIn} />
            </Switch>
        </div >
    );
}
export default MainPage;
