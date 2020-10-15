import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles, Button,TextField } from '@material-ui/core';
import { useFormik } from 'formik';

import subscriptionUtils from '../../../Utils/SubscriptionUtils.js';
import common from '../../../Utils/Common';
import './AddMember.css';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },

}));

function AddMember(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const history = useHistory();

    const onCancelMember = () => {
        navigateToAllMembers();
    }

    const navigateToAllMembers = () => {
        props.history.push(common.allMembers);
        const current = history.location.pathname;
        props.history.replace(common.reload);
        setTimeout(() => {
            props.history.replace(current);
        });
    }

    const validate = values => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Please enter name of member.';
        }

        if (!values.email) {
            errors.email = 'Please enter your email.';
        }
        else if (!common.validateEmail(values.email)) {
            errors.email = 'Please enter a valid email.';
        }

        if (!values.city) {
            errors.city = 'Please enter your city.';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            city: ''
        },
        validate,
        onSubmit: async values => {

            let addMember = {};
            addMember.name = values.name;
            addMember.email = values.email;
            addMember.city = values.city;
             let results = await subscriptionUtils.addMember(addMember);
            if (results.isSuccess) {
                navigateToAllMembers();
            }
            else {
                setErrorMessage(results.errorMessage);
            }
        },
    });

    return (
        <div >
            <br />
            <h6>Add Member</h6>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Name"
                        placeholder="Enter name of member."
                        name="name" onChange={formik.handleChange} value={formik.values.name}
                        onBlur={formik.handleBlur}
                        autoFocus
                    />
                </div><br />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Email"
                        placeholder="Enter valid email address."
                        name="email" onChange={formik.handleChange} value={formik.values.email}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.email && formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-basic" label="City"
                        placeholder="Enter enter your city."
                        name="city" onChange={formik.handleChange} value={formik.values.city}
                        onBlur={formik.handleBlur}

                    />
                </div><br />
                {formik.touched.city && formik.errors.city ? (
                    <div>{formik.errors.city}</div>
                ) : null}
                <Button type="submit" variant="contained" color="primary" className={classes.margin}>Add</Button>
                <Button variant="contained" color="primary" onClick={onCancelMember} className={classes.margin}>Cancel</Button><br />
                {errorMessage}
            </form>
        </div>
    );
}
export default AddMember;
