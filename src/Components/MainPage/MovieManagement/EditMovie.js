import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles, Button, TextField } from '@material-ui/core';
import { useFormik } from 'formik';

import movieUtils from '../../../Utils/MovieUtils.js';
import common from '../../../Utils/Common';
import './EditMovie.css';
let moment = require('moment');

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },

}));
function EditMovie(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();
    const [movie, setMovie] = useState({});
    const history = useHistory();

    useEffect(() => {
        async function getMovieById() {
            let movieId = props.match.params.movieId;
            let results = await movieUtils.getMovieById(movieId);
            if (results.isSuccess) {
                setMovie(results.movie);
                formik.setFieldValue("name", results.movie.movieData.name, false);
                formik.setFieldValue("genres", results.movie.movieData.genres, false);
                formik.setFieldValue("imageUrl", results.movie.movieData.image, false);
                formik.setFieldValue("premiered", moment(results.movie.movieData.premiered).format('YYYY-MM-DD'), false);
            }
            else {
                setErrorMessage(results.errorMessage);
            }

        }
        getMovieById();
    }, []);

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

        if (!values.genres || values.genres.length == 0) {
            errors.genres = 'Please enter genres values seperted by comma.';
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
            let editMovie = {};
            editMovie.id = movie.id;
            editMovie.name = values.name;
            let genresArr = [];
            values.genres.toString().split(',').forEach((genre, index) => {
                genresArr.push(genre);
            });
            editMovie.genres = genresArr;
            editMovie.imageUrl = values.imageUrl;
            editMovie.premiered = values.premiered;
        
            let results = await movieUtils.updateMovie(editMovie);
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
            {
                <div >
                    <br />
                    <h6>Edit Movie: {movie.name}</h6>
                    <form onSubmit={formik.handleSubmit}>
                        <br />
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
                            <TextField className="textLength" required id="genres" label="Genres"
                                name="genres" onChange={formik.handleChange} value={formik.values.genres}
                                onBlur={formik.handleBlur}
                            />
                        </div><br />
                        {formik.touched.genres && formik.errors.genres ? (
                            <div>{formik.errors.genres}</div>
                        ) : null}
                        <div>
                            <TextField className="textLength" required id="imageUrl" label="Image Url"
                                name="imageUrl" onChange={formik.handleChange} value={formik.values.imageUrl}
                                onBlur={formik.handleBlur}
                            />
                        </div><br />
                        {formik.touched.imageUrl && formik.errors.imageUrl ? (
                            <div>{formik.errors.imageUrl}</div>
                        ) : null}
                        <div>
                            <TextField id="premiered" className={`${"textLength"}`} label="Premiered" type="date"
                                InputLabelProps={{ shrink: true }}
                                name="premiered" onChange={formik.handleChange} value={formik.values.premiered}
                                onBlur={formik.handleBlur}
                            />
                        </div><br />
                        {formik.touched.premiered && formik.errors.premiered ? (
                            <div>{formik.errors.premiered}</div>
                        ) : null}
                        <div>
                            <Button type="submit" variant="contained" color="primary" className={classes.margin}>Update</Button>
                            <Button variant="contained" color="primary" onClick={onCancelMovie} className={classes.margin}>Cancel</Button>
                        </div><br />
                        {errorMessage}
                    </form>
                </div>}
        </div>
    );
}
export default EditMovie;
