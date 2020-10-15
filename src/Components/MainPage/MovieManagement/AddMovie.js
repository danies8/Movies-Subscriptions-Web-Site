import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import {makeStyles, TextField, Button} from '@material-ui/core';
import { useFormik } from 'formik';

import './AddMovie.css';
import movieUtils from '../../../Utils/MovieUtils.js';
import common from '../../../Utils/Common';
let moment = require('moment');

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

function AddMovie(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const history = useHistory();

    const onCancelMovie = () => {
        navigateToAllMovies();
    }

    const navigateToAllMovies = () => {
        props.history.push(common.allMovies);
        const current = history.location.pathname;
        props.history.replace(common.reload);
        setTimeout(() => {
            props.history.replace(current);
        });
    }

    const validate = values => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Please enter name of movie.';
        }

        if (!values.genres) {
            errors.genres = 'Please enter your genres seperted by comma.';
        }
        else if (values.genres.split(',').length == 0) {
            errors.genres = 'Please enter your genres values seperted by comma.';
        }

        if (!values.imageUrl) {
            errors.imageUrl = 'Please enter image url.';
        }
        else if (!common.isValidImageURL(values.imageUrl)) {
            errors.imageUrl = 'Please enter valid image url.';
        }

        if (!values.premiered) {
            errors.premiered = 'Please select premiered.';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            genres: '',
            imageUrl: '',
            premiered: ''
        },
        validate,
        onSubmit: async values => {
            let addMovie = {};
            addMovie.name = values.name;
            let genresArr = [];
            values.genres.split(',').forEach((genre, index) => {
                genresArr.push(genre)
            });
            addMovie.genres = genresArr;
            addMovie.image = values.imageUrl;
            addMovie.premiered = moment(values.premiered).format('YYYY-MM-DD');

            let results = await movieUtils.addMovie(addMovie);
            if (results.isSuccess) {
                navigateToAllMovies();
            }
            else {
                setErrorMessage(results.errorMessage);
            }
        },
    });

    return (
        <div >
            <h6>Add Movie</h6>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Name"
                        placeholder="Enter name of the movie"
                        name="name" onChange={formik.handleChange} value={formik.values.name}
                        onBlur={formik.handleBlur}
                        autoFocus
                    />
                </div><br />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Genres"
                        placeholder="Enter genres split by ,"
                        name="genres" onChange={formik.handleChange} value={formik.values.genres}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.genres && formik.errors.genres ? (
                    <div>{formik.errors.genres}</div>
                ) : null}
                <div>
                    <TextField className="textLength" required id="standard-basic" label="Image url"
                        placeholder="Enter valid image url."
                        name="imageUrl" onChange={formik.handleChange} value={formik.values.imageUrl}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.imageUrl && formik.errors.imageUrl ? (
                    <div>{formik.errors.imageUrl}</div>
                ) : null}
                <div>
                    <TextField id="date" className={`${classes.textField} ${"textLength"}`} label="Premiered" type="date"
                        InputLabelProps={{ shrink: true }}
                        name="premiered" onChange={formik.handleChange} value={formik.values.premiered}
                        onBlur={formik.handleBlur}
                    />
                </div><br />
                {formik.touched.premiered && formik.errors.premiered ? (
                    <div>{formik.errors.premiered}</div>
                ) : null}
                <Button type="submit" variant="contained" color="primary" className={classes.margin}>Add</Button>
                <Button variant="contained" color="primary" onClick={onCancelMovie} className={classes.margin}>Cancel</Button><br />
                {errorMessage}
            </form>
        </div>
    );
}
export default AddMovie;
