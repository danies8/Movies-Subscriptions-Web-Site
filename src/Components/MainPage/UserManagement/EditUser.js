import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles, Button, TextField, FormControlLabel , Checkbox, withStyles} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useFormik } from 'formik';

import userUtils from '../../../Utils/UserUtils.js';
import common from '../../../Utils/Common';

let moment = require('moment');


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const BlueCheckbox = withStyles({
    root: {
        color: blue[800],
        '&$checked': {
            color: blue[800],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);


function EditUser(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        async function getUserById() {
            let userId = props.match.params.userId;
            let results = await userUtils.getUserById(userId);
             if (results.isSuccess) {
                formik.setFieldValue("firstName", results.user.userData.firstName, false);
                formik.setFieldValue("lastName", results.user.userData.lastName, false);
                formik.setFieldValue("createdDate", moment(results.user.userData.createdDate).format('YYYY-MM-DD'), false);
                formik.setFieldValue("userName", results.user.userName, false);
                formik.setFieldValue("currentUserName", results.user.userName, false);
                formik.setFieldValue("sessionTimeout", results.user.userData.sessionTimeout, false);
                const permissionData = results.user.permissions;
                setPermissionData(permissionData);
                setUser(results.user.userData);
            }
            else {
                setErrorMessage(results.errorMessage);
            }
        }
        getUserById();
    }, []);

    const setPermissionData = (permissionData) => {
        permissionData.forEach((permission, i) => {
            if (permission === "View Subscriptions") {
                formik.setFieldValue("isViewSubscriptions", true, false);
            }
            else if (permission === "Create Subscriptions") {
                formik.setFieldValue("isCreateSubscriptions", true, false);
            }
            else if (permission === "Delete Subscriptions") {
                formik.setFieldValue("isDeleteSubscriptions", true, false);
            }
            else if (permission === "Update Subscriptions") {
                formik.setFieldValue("isUpdateSubscriptions", true, false);
            }
            else if (permission === "View Movies") {
                formik.setFieldValue("isViewMovies", true, false);
            } else if (permission === "Create Movies") {
                formik.setFieldValue("isCreateMovies", true, false);
            } else if (permission === "Delete Movies") {
                formik.setFieldValue("isDeleteMovies", true, false);
            } else if (permission === "Update Movies") {
                formik.setFieldValue("isUpdateMovies", true, false);
            }
        });
        return permissionData;
    }

    const onCancelUser = () => {
        navigateToAllUsers();
    }

    const navigateToAllUsers = () => {
        props.history.push(common.allUsers);
        const current = history.location.pathname;
        props.history.replace(common.reload);
        setTimeout(() => {
            props.history.replace(current);
        });
    }
    const createSubscriptions = (e) => {
         if (e.target.checked === true) {
            formik.setFieldValue("isViewSubscriptions", true, false);
        }
        formik.setFieldValue("isCreateSubscriptions", e.target.checked, false);
    }
    const updateSubscriptions = (e) => {
        if (e.target.checked === true) {
            formik.setFieldValue("isViewSubscriptions", true, false);
        }
        formik.setFieldValue("isUpdateSubscriptions", e.target.checked, false);
    }
    const deleteSubscriptions = (e) => {
        if (e.target.checked === true) {
            formik.setFieldValue("isViewSubscriptions", true, false);
        }
        formik.setFieldValue("isDeleteSubscriptions", e.target.checked, false);
    }

    const createMovies = (e) => {
        if (e.target.checked === true) {
            formik.setFieldValue("isViewMovies", true, false);
        }
        formik.setFieldValue("isCreateMovies", e.target.checked, false);
    }

    const updateMovies = (e) => {
        if (e.target.checked === true) {
            formik.setFieldValue("isViewMovies", true, false);
        }
        formik.setFieldValue("isUpdateMovies", e.target.checked, false);
    }

    const deleteMovies = (e) => {
        if (e.target.checked === true) {
            formik.setFieldValue("isViewMovies", true, false);
        }
        formik.setFieldValue("isDeleteMovies", true, false);
    }

    const validate = async values => {
        const errors = {};
        if (!values.firstName) {
            errors.firstName = 'Please enter your first name.';
        }

        if (!values.lastName) {
            errors.lastName = 'Please enter your last name.';
        }

        if (!values.createdDate) {
            errors.createdDate = 'Please enter your create date.';
        }

        if (!values.sessionTimeout) {
            errors.sessionTimeout = 'Please enter your session timeout.';
        }
        else if (!common.isNumeric(values.sessionTimeout)) {
            errors.sessionTimeout = "Please enter your number bigger than zero for timeout."
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            createdDate: '',
            userName: '',
            currentUserName: '',
            sessionTimeout: 0,
            isViewSubscriptions: false,
            isCreateSubscriptions: false,
            isDeleteSubscriptions: false,
            isUpdateSubscriptions: false,
            isViewMovies: false,
            isCreateMovies: false,
            isDeleteMovies: false,
            isUpdateMovies: false,
        },
        validate,
        onSubmit: async values => {
            let editUser = {};
            editUser.id = props.match.params.userId;
            editUser.logInId = user.logInId;
            editUser.firstName = values.firstName;
            editUser.lastName = values.lastName;
            editUser.createdDate = values.createdDate;
            editUser.userName = values.userName;
            editUser.sessionTimeout = values.sessionTimeout;

            let permissions = [];
            if (values.isViewSubscriptions) {
                permissions.push("View Subscriptions");;
            }
            if (values.isCreateSubscriptions) {
                permissions.push("Create Subscriptions");
            }
            if (values.isDeleteSubscriptions) {
                permissions.push("Delete Subscriptions");
            }
            if (values.isUpdateSubscriptions) {
                permissions.push("Update Subscriptions");
            }
            if (values.isViewMovies) {
                permissions.push("View Movies");
            }
            if (values.isCreateMovies) {
                permissions.push("Create Movies");
            }
            if (values.isDeleteMovies) {
                permissions.push("Delete Movies");
            }
            if (values.isUpdateMovies) {
                permissions.push("Update Movies");
            }
             editUser.permissions = permissions;

            let results = await userUtils.updateUser(editUser);
            if (results.isSuccess) {
                navigateToAllUsers();
            }
            else {
                setErrorMessage(results.errorMessage);
            }
        },
    });


    return (
        <div >
            <br />
            <h6>Edit User:{user.name}</h6>
            <form onSubmit={formik.handleSubmit} >
                <div>
                    <TextField className="textLength" required id="standard-basic" label="First Name"
                        name="firstName" onChange={formik.handleChange} value={formik.values.firstName}
                        onBlur={formik.handleBlur}
                        autoFocus
                    />
                </div><br />
                {formik.touched.firstName && formik.errors.firstName ? (
                    <div>{formik.errors.firstName}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Last Name"
                        name="lastName" onChange={formik.handleChange} value={formik.values.lastName}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.lastName && formik.errors.lastName ? (
                    <div>{formik.errors.lastName}</div>
                ) : null}
                <div>
                    <TextField id="createdDate" className={`${classes.textField} ${"textLength"}`} label="Created Date" type="date"
                        InputLabelProps={{ shrink: true }}
                        name="createdDate" onChange={formik.handleChange} value={formik.values.createdDate}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.createdDate && formik.errors.createdDate ? (
                    <div>{formik.errors.createdDate}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-read-only-input" label="User Name"
                        name="userName" onChange={formik.handleChange} value={formik.values.userName}
                          InputProps={{
                            readOnly: true,
                          }}
                    />
                </div><br />
               
                <div>
                    <TextField  className="textLength"  id="standard-basic" label="Session time out (minites)"
                        name="sessionTimeout" onChange={formik.handleChange} value={formik.values.sessionTimeout}
                        onBlur={formik.handleBlur}
                       
                    />
                </div><br />
                {formik.touched.sessionTimeout && formik.errors.sessionTimeout ? (
                    <div>{formik.errors.sessionTimeout}</div>
                ) : null}
                 Permissions: <br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isViewSubscriptions" name="isViewSubscriptions" onChange={formik.handleChange} checked={formik.values.isViewSubscriptions}
                    />}
                    label="View Subscriptions"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isCreateSubscriptions" name="isCreateSubscriptions" onChange={e => createSubscriptions(e)} checked={formik.values.isCreateSubscriptions}
                    />}
                    label="Create Subscriptions"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isDeleteSubscriptions" name="isDeleteSubscriptions" onChange={e => deleteSubscriptions(e)} checked={formik.values.isDeleteSubscriptions}
                    />}
                    label="Delete Subscriptions"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isUpdateSubscriptions" name="isUpdateSubscriptions" onChange={e => updateSubscriptions(e)} checked={formik.values.isUpdateSubscriptions}
                    />}
                    label="Update Subscriptions"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isViewMovies" name="isViewMovies" onChange={formik.handleChange} checked={formik.values.isViewMovies}
                    />}
                    label="View Movies"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isCreateMovies" name="isCreateMovies" onChange={e => createMovies(e)} checked={formik.values.isCreateMovies}
                    />}
                    label="Create Movies"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isDeleteMovies" name="isDeleteMovies" onChange={e => deleteMovies(e)} checked={formik.values.isDeleteMovies}
                    />}
                    label="Delete Movies"
                /><br />
                <FormControlLabel
                    control={<BlueCheckbox
                        id="isUpdateMovies" name="isUpdateMovies" onChange={e => updateMovies(e)} checked={formik.values.isUpdateMovies}
                    />}
                    label="Update Movies"
                /><br />
                <Button type="submit" variant="contained" color="primary" className={classes.margin}>Update</Button>
                <Button variant="contained" color="primary" onClick={onCancelUser} className={classes.margin}>Cancel</Button><br />
                {errorMessage}
            </form>
        </div>
    );
}
export default EditUser;
