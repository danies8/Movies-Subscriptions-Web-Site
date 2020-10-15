import React, { useState } from 'react';
import { withStyles, makeStyles, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useFormik } from 'formik';

import userUtils from '../../../Utils/UserUtils.js';
import { useHistory } from "react-router-dom";
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

function AddUser(props) {

    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const history = useHistory();

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
        formik.setFieldValue("isDeleteMovies", e.target.checked, false);
    }


    const validate = async values => {
        const errors = {};
        if (!values.firstName) {
            errors.firstName = 'Please enter your first name.';
        }

        if (!values.lastName) {
            errors.lastName = 'Please enter your last name.';
        }

        if (!values.userName) {
            errors.userName = 'Please enter your user name.';
        }
        else if (!common.validateEmail(values.userName)) {
            errors.userName = 'Please enter a valid email.';
        }
        else if (await userUtils.isUserNameExist(values.userName)) {
            errors.userName = "Please enter other user name."
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
            userName: '',
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

            let addUser = {};
            let addPermissions = {};
            let loginUser = {};
            addUser.firstName = values.firstName;
            addUser.lastName = values.lastName;
            addUser.createdDate = moment().format('YYYY-MM-DD');
            loginUser.userName = values.userName;
            addUser.sessionTimeout = values.sessionTimeout;
     
            let permissions = [];
            if (values.isViewSubscriptions) {
                permissions.push("View Subscriptions");
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
            addPermissions.permissions = permissions;
            const results = await userUtils.addUser(addUser, addPermissions, loginUser);
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
            <form onSubmit={formik.handleSubmit} >
                <div >
                    <br />
                    <h6>Add New User</h6>
                    <div>
                        <TextField className="textLength" required id="standard-basic" label="First Name"
                            placeholder="Please enter your first name."
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
                            placeholder="Please enter your last name."
                            name="lastName" onChange={formik.handleChange} value={formik.values.lastName}
                            onBlur={formik.handleBlur}
                        />
                    </div><br />
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <div>{formik.errors.lastName}</div>
                    ) : null}
                    <div>
                        <TextField className="textLength" required id="standard-basic" label="User Name"
                            placeholder="Please enter your user name."
                            name="userName" onChange={formik.handleChange} value={formik.values.userName}
                            onBlur={formik.handleBlur}
                        />
                    </div><br />
                    {formik.touched.userName && formik.errors.userName ? (
                        <div>{formik.errors.userName}</div>
                    ) : null}
                    <div>
                        <TextField className="textLength" required id="standard-basic" label=" Session time out(Minites)"
                            placeholder="Please enter valid seesion timeout."
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
                    <Button type="submit" variant="contained" color="primary" className={classes.margin}>Add</Button>
                    <Button variant="contained" color="primary" onClick={onCancelUser} className={classes.margin}>Cancel</Button><br />
                    {errorMessage}
                </div>
            </form>
        </div>
    );
}
export default AddUser;
