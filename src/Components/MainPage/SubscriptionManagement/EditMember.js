import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles, Button, TextField } from '@material-ui/core';
import { useFormik } from 'formik';

import subscriptionUtils from '../../../Utils/SubscriptionUtils.js';
import common from '../../../Utils/Common';
import './Member.css';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },

}));

function EditMember(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const [member, setMember] = useState({});
    const history = useHistory();

    useEffect(() => {
        async function getMemberById() {
            let memberId = props.match.params.memberId;
            let results = await subscriptionUtils.getMemberById(memberId);
            if (results.isSuccess) {
                setMember(results.member);
                formik.setFieldValue("name", results.member.memberData.name, false);
                formik.setFieldValue("email", results.member.memberData.email, false);
                formik.setFieldValue("city", results.member.memberData.city, false);
            }
            else {
                setErrorMessage(results.errorMessage);
            }


        }
        getMemberById();
    }, []);


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
            errors.city = 'Please your city.';
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

            let editMember = {};
            editMember.id = member.id;
            editMember.name = values.name;
            editMember.email = values.email;
            editMember.city = values.city;
            let results = await subscriptionUtils.updateMember(editMember);
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
            {
                <div >
                    <br />
                    <h6>Edit Memmber: {member.name}</h6>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <TextField className="textLength" required id="standard-basic" label="Name"
                                name="name" onChange={formik.handleChange} value={formik.values.name}
                                onBlur={formik.handleBlur}
                                autoFocus
                            />
                        </div><br />
                        {formik.touched.name && formik.errors.name ? (
                            <div>{formik.errors.name}</div>
                        ) : null}
                        <div>
                            <TextField className="textLength" required id="email" label="Email"
                                name="email" onChange={formik.handleChange} value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                        </div><br />
                        {formik.touched.email && formik.errors.email ? (
                            <div>{formik.errors.email}</div>
                        ) : null}
                        <div>
                            <TextField className="textLength" required id="city" label="City"
                                name="city" onChange={formik.handleChange} value={formik.values.city}
                                onBlur={formik.handleBlur}
                            />
                        </div><br />
                        {formik.touched.city && formik.errors.city ? (
                            <div>{formik.errors.city}</div>
                        ) : null}
                        <Button type="submit" variant="contained" color="primary" className={classes.margin}>Update</Button>
                        <Button variant="contained" color="primary" onClick={onCancelMember} className={classes.margin}>Cancel</Button><br />
                        {errorMessage}
                    </form>
                </div>}
        </div>
    );
}
export default EditMember;
