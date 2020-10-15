import React, { useState, useContext } from 'react';
import {makeStyles, Button, CssBaseline,Container, TextField } from '@material-ui/core';
import { useFormik } from 'formik';

import logInUtils from '../../Utils/LogInUtils.js'
import { AppContext } from '../../AppContext';
import common from '../../Utils/Common';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));


function LogInPage(props) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");

   const { userId, isUserAdmin,
    hasPermissionForSubscriptions, hasPermissionForCreateSubscriptions, hasPermissionForEditSubscriptions, hasPermissionForDeleteSubscriptions,
    hasPermissionForMovies, hasPermissionForCreateMovies, hasPermissionForEditMovies, hasPermissionForDeleteMovies,
    loginUserName } = useContext(AppContext);
  const [,setUserId] = userId;
  const [,setIsUserAdmin] = isUserAdmin;

  const [,setHasPermissionForSubscriptions] = hasPermissionForSubscriptions;
  const [,setHasPermissionForCreateSubscriptions] = hasPermissionForCreateSubscriptions;
  const [,setHasPermissionForEditSubscriptions] = hasPermissionForEditSubscriptions;
  const [,setHasPermissionForDeleteSubscriptions] = hasPermissionForDeleteSubscriptions;

  const [,setHasPermissionForMovies] = hasPermissionForMovies;
  const [,setHasPermissionForCreateMovies] = hasPermissionForCreateMovies;
  const [,setHasPermissionForEditMovies] = hasPermissionForEditMovies;
  const [,setHasPermissionForDeleteMovies] = hasPermissionForDeleteMovies;

  const [,setLoginUserName] = loginUserName;

  
  const validate = values => {
    const errors = {};
  
    if (!values.userName) {
      errors.userName = 'Please enter your email.';
    }
    else if (!common.validateEmail(values.userName)) {
      errors.userName = 'Please enter a valid email.';
    }

    if (!values.password) {
      errors.password = 'Please enter your password.';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },
    validate,
    onSubmit: async values => {
      const logInObj = {};
      logInObj.userName = values.userName;
      logInObj.password = values.password;

      const results = await logInUtils.getUserInfo(logInObj);
      if (results.isUserExist) {
        setUserId(results.userId);
        setIsUserAdmin(results.isUserAdmin);

        setHasPermissionForSubscriptions(results.hasPermissionForSubscriptions);
        setHasPermissionForCreateSubscriptions(results.hasPermissionForCreateSubscriptions);
        setHasPermissionForEditSubscriptions(results.hasPermissionForEditSubscriptions);
        setHasPermissionForDeleteSubscriptions(results.hasPermissionForDeleteSubscriptions);

        setHasPermissionForMovies(results.hasPermissionForMovies);
        setHasPermissionForCreateMovies(results.hasPermissionForCreateMovies);
        setHasPermissionForEditMovies(results.hasPermissionForEditMovies);
        setHasPermissionForDeleteMovies(results.hasPermissionForDeleteMovies);

        setLoginUserName(results.userName);
        props.history.push(common.welcomePage);
      }
      else {
        setErrorMessage(results.errorMessage);
      }
    },
  });

  return (
       <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <h5>Log in Page</h5>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <TextField required  id="standard-basic" label="User name" 
                 name="userName" onChange={formik.handleChange} value={formik.values.userName}
                onBlur={formik.handleBlur}
                autoFocus 
              />
            </div><br />
            {formik.touched.userName && formik.errors.userName ? (
              <div>{formik.errors.userName}</div>
            ) : null}
            <div>
              <TextField required label="Password" id="standard-password-input" type="password" 
                  autoComplete="current-password" 
                 name="password" onChange={formik.handleChange} value={formik.values.password}
                onBlur={formik.handleBlur}
              />
            </div><br />
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
            <Button type="submit" variant="contained" color="primary" >Login</Button><br />
             <br />
             {errorMessage}
          </form>
        </Container>
      </React.Fragment>
  );
}
export default LogInPage;
