import React, { useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';

import userUtils from '../../../Utils/UserUtils.js';
import './User.css';
import common from '../../../Utils/Common.js';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 18,
    },
    pos: {
        marginBottom: 12,
    },
});

function User(props) {
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState("");

    const [isVisibleStyle, setIsVisibleStyle] = useState(true);
    const history = useHistory();
  
    const onEditUser = (e) => {
        e.preventDefault();
        setIsVisibleStyle(false);
        history.push(`${common.editUser}/${props.user.id}`)
        props.onUserClickOnEditCallback(props.user.id);
    }
    const onDeleteUser = async () => {
        const results = await userUtils.deleteUser(props.user.id);
        if (results.isSuccess) {
            props.onUserClickOnDeleteCallback(props.user.id);
        }
        else {
            setErrorMessage(results.errorMessage);
        }

    }
    
    let visibleStyle;
    if (isVisibleStyle) {
        visibleStyle = "visibleStyle";
    }
    else {
        visibleStyle = "hiddenStyle";
    }

    return (
        <div>
            <form onSubmit={e => onEditUser(e)}>
                <div className="userBorderStyle">
                    <div className={visibleStyle}>
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <strong>Name:</strong> {props.user.userData.firstName}&nbsp;{props.user.userData.lastName}<br />
                                    <strong> User Name:</strong> {props.user.userName} <br />
                                    <strong>Session time out (minites):</strong>{props.user.userData.sessionTimeout} <br />
                                    <strong>Created date:</strong> {props.user.userData.createdDate} <br />
                                    <strong>Permissions:</strong>{props.user.permissions?.join(",")} <br />
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button type="submit" variant="contained" color="primary" className={classes.margin} >Edit
                                 </Button>
                                <Button variant="contained" color="primary" onClick={onDeleteUser} className={classes.margin}>Delete</Button><br />
                            </CardActions>
                        </Card>
                        {errorMessage}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default User;
