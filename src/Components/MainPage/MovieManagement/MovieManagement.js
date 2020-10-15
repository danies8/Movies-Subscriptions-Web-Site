import React, { useContext, useEffect } from 'react';
import { Route, Switch, useHistory, NavLink } from 'react-router-dom';
import {makeStyles, Typography, Button, TextField} from '@material-ui/core';
import { useFormik } from 'formik';

import AllMovies from './AllMovies';
import AddMovie from './AddMovie';
import './MovieManagement.css';
import { AppContext } from '../../../AppContext';
import common from '../../../Utils/Common';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
            flexGrow: 1,
        },
    },
}));

function Movies(props) {
    const classes = useStyles();

    const { isUserAdmin, hasPermissionForCreateMovies } = useContext(AppContext);
    const [stateIsUserAdmin] = isUserAdmin;
    const [stateHasPermissionForCreateMovies] = hasPermissionForCreateMovies;
  
    const { filterMovieName } = useContext(AppContext);
    const [, setFilterMovieName] = filterMovieName;
    const history = useHistory();
  
    useEffect(() => {
        function loadAllMoviesFirstTime() {
            history.push(common.allMovies);
        }
        loadAllMoviesFirstTime();
    }, []);

    const validate = values => {
        const errors = {};
        
        if (!values.findMovieName) {
            errors.findMovieName = 'Please enter movie name.';
        }

        return errors;
    }
    const formik = useFormik({
        initialValues: {
            findMovieName: '',
        },
        validate,
        onSubmit: values => {
            setFilterMovieName(values.findMovieName);

            history.push(common.allMovies);
            const current = history.location.pathname;
            props.history.replace(common.reload);
            setTimeout(() => {
                props.history.replace(current);
            });
        },
    });

    
        return (
            <div className="movieManagementBorderStyle" className={classes.root}>
                <h3>Movies</h3>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="floatMoviesLinksLeft">
                            <Typography className={classes.root}>
                                <NavLink to={`${common.allMovies}`} activeStyle={{ backgroundColor: common.menuColor }}>All Movies</NavLink>
                               {
                                   stateIsUserAdmin || stateHasPermissionForCreateMovies?
                                   <NavLink to={`${common.addMovie}`} activeStyle={{ backgroundColor: common.menuColor }}>Add Movie</NavLink>
                                  :""
                               }
                             </Typography >
                        </div>
                        <div className="paddingLeftFindMovies">
                            <TextField required  id="standard-basic" label="Find movie"
                                  name="findMovieName" onChange={formik.handleChange} value={formik.values.findMovieName}
                                  onBlur={formik.handleBlur}
                                  autoFocus
                              />
                          <Button type="submit" variant="contained" color="primary" >Find</Button>
                            {formik.touched.findMovieName && formik.errors.findMovieName ? (
                                  <div>{formik.errors.findMovieName}</div>
                              ) : null}
                        </div>
                        <br />
                    </div>
                </form>
                <Switch>
                    <Route path={`${common.reload}`} component={null} key="reload" />
                    <Route path={`${common.movieName}`} component={AllMovies} />
                    <Route path={`${common.allMovies}`} component={AllMovies} />
                    <Route path={`${common.addMovie}`} component={AddMovie} />
                </Switch>
            </div>

        );
}
export default Movies;
