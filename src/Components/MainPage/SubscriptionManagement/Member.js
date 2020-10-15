import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {makeStyles, Accordion, AccordionSummary, AccordionDetails, Typography,
    Button, TextField, Select, InputLabel, MenuItem, FormControl} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from 'react-bootstrap/Card';
import { useFormik } from 'formik';

import subscriptionUtils from '../../../Utils/SubscriptionUtils.js';
import movieUtils from '../../../Utils/MovieUtils.js';
import './Member.css';
import { useHistory } from "react-router-dom";
import { AppContext } from '../../../AppContext';
import common from '../../../Utils/Common';
let moment = require('moment');

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },

    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

function Member(props) {
    const [errorMessage, setErrorMessage] = useState("");

    const classes = useStyles();

    const { isUserAdmin, hasPermissionForEditSubscriptions, hasPermissionForDeleteSubscriptions } = useContext(AppContext);
    const [stateIsUserAdmin] = isUserAdmin;
    const [stateHasPermissionForEditSubscriptions] = hasPermissionForEditSubscriptions;
    const [stateHasPermissionForDeleteSubscriptions] = hasPermissionForDeleteSubscriptions;

    const [isVisibleStyle, setIsVisibleStyle] = useState(true);
    const [toggleAddMovieArea, setToggleAddMovieArea] = useState(true);
    const [visibiltyAddMovieArea, setVisibiltyAddMovieArea] = useState("hiddenStyle");
    const [moviesNames, setMoviesName] = useState([]);

    const history = useHistory();

    useEffect(() => {
        function setMovieDateTextInput() {
            formik.setFieldValue("movieDate", moment().format('YYYY-MM-DD'), false);
        }
        setMovieDateTextInput();
    }, []);

    const onEditMember = () => {
        setIsVisibleStyle(false);
        history.push(`${common.editMemberWithId}/${props.memberSubscriptionData.memberData.id}`)
        props.onUserClickOnEditMemberCallback(props.memberSubscriptionData.memberData.id);
    }
    const onDeleteMember = async () => {
        let results = await subscriptionUtils.deleteMember(props.memberSubscriptionData.memberData.id);
        if (results.isSuccess) {
            props.onUserClickOnDeleteMemberCallback(props.memberSubscriptionData.memberData.id);
        }
        else {
            setErrorMessage(results.errorMessage);
        }
    }

    const goToAllMembers = () => {
        history.push(common.allMembers);
        const current = history.location.pathname;
        history.replace(common.reload);
        setTimeout(() => {
            history.replace(current);
        }, 30);
    }

    const toggleSubscirbeToNewMovie = async () => {
        setToggleAddMovieArea(!toggleAddMovieArea);
        if (toggleAddMovieArea) {
            setVisibiltyAddMovieArea("visibleStyle");
            let results = await movieUtils.getAllMoviesNames();
            if (results.isSuccess) {
                setMoviesName(results.moviesNames);
            }
            else {
                setErrorMessage(results.errorMessage);
            }
        }
        else {
            setVisibiltyAddMovieArea("hiddenStyle");
        }
    }

    const validate = values => {
        const errors = {};
        if (!values.selectedMovieName) {
            errors.selectedMovieName = 'Please selecte a movie.';
        }

        if (!values.movieDate) {
            errors.movieDate = 'Please selecte subscription date.';
        }
        else if (moment().format("YYYY-MM-DD") > moment(values.movieDate).format("YYYY-MM-DD")) {
            errors.movieDate = "Subscription can be in future only.";
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            selectedMovieName: '',
            movieDate: '',
        },
        validate,
        onSubmit: async values => {
            let newMovieDataObj = {};
            newMovieDataObj.name = values.selectedMovieName;
            newMovieDataObj.premiered = values.movieDate;
            let results = await subscriptionUtils.subscirbeToNewMovie(newMovieDataObj, props.memberSubscriptionData.memberData.id);
            if (results.isSuccess) {
                goToAllMembers();
            }
            else {
                setErrorMessage(results.errorMessage);
            }

        },
    });

    let visibleStyle;
    if (isVisibleStyle) {
        visibleStyle = "visibleStyle";
    }
    else {
        visibleStyle = "hiddenStyle";
    }

    let movieOptions;
    if (moviesNames.length > 0) {
        movieOptions = moviesNames.map((movieName, index) => {
            return <MenuItem index={index} value={movieName}>{movieName}</MenuItem>
        });
    }

    return (
        <form onSubmit={formik.handleSubmit} >
            <div className="memberBorderStyle">
                <div className={visibleStyle}>
                    <h6>{props.memberSubscriptionData.memberData.member.name}</h6>
                    <strong>Email:</strong>{props.memberSubscriptionData.memberData.member.email} <br />
                    <strong>City:</strong>{props.memberSubscriptionData.memberData.member.city} <br />
                    {
                        stateIsUserAdmin || stateHasPermissionForEditSubscriptions ?
                            <Button variant="outlined" color="primary" onClick={onEditMember} size="small" className={classes.margin}>Edit</Button>
                            : ""
                    }
                    {
                        stateIsUserAdmin || stateHasPermissionForDeleteSubscriptions ?
                            <Button variant="outlined" color="primary" onClick={onDeleteMember} size="small" className={classes.margin}>Delete</Button>
                            : ""
                    }
                    <br />
                    <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography component={'span'} className={classes.heading}><h6>Movies Watched</h6></Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component={'span'}>
                                    <div className="subscribedBorderStyle">
                                        <Button variant="contained" color="primary" onClick={toggleSubscirbeToNewMovie}>Subscirbe to new movie</Button>
                                        <br />
                                        <div className={`${visibiltyAddMovieArea} ${"addSubscribionBorderStyle"}`}>
                                            <h6>Add a new movie</h6>

                                            <FormControl required className={classes.formControl}>
                                                <InputLabel id="movies">Movie name</InputLabel>
                                                <Select
                                                    labelId="movies"
                                                    id="selectedMovieName" name="selectedMovieName"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    {movieOptions}
                                                </Select><br />
                                                {formik.touched.selectedMovieName && formik.errors.selectedMovieName ? (
                                                    <div>{formik.errors.selectedMovieName}</div>
                                                ) : null}
                                                <TextField
                                                    id="date"
                                                    name="movieDate"
                                                    label="Movie date"
                                                    type="date"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.movieDate}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                /><br />
                                                {formik.touched.movieDate && formik.errors.movieDate ? (
                                                    <div>{formik.errors.movieDate}</div>
                                                ) : null}
                                                <Button type="submit" variant="outlined" color="primary" size="small" className={classes.margin}>Subscirbe</Button>
                                            </FormControl><br />
                                        </div> <br />
                                        <div>
                                            {
                                                props.memberSubscriptionData.moviesData?.map((movieData, key) => {
                                                    return <div key={key}>
                                                       <Card key={key} style={{ width: '20rem' }}>
                                                        <Card.Body>
                                                            <Card.Text>
                                                                <strong>Link To Movie:</strong><NavLink to={`${common.allMovies}/${movieData.name}`} >{movieData.name} </NavLink><br />
                                                                <strong>Date:</strong>{movieData.date}
                                                            </Card.Text>

                                                        </Card.Body>
                                                    </Card>
                                                    <br/>
                                                    </div>
                                                    
                                                })
                                            }
                                        </div>
                                    </div>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                </div>
                {errorMessage}
            </div>
        </form>
    );
}
export default Member;
