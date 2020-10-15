import React, { useState, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {ListGroup, Card} from 'react-bootstrap';
import {makeStyles, Button,Accordion,AccordionSummary,AccordionDetails, Typography, Box} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppContext } from '../../../AppContext';
import movieUtils from '../../../Utils/MovieUtils.js';
import './Movie.css';
import common from '../../../Utils/Common';

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
    
}));

function Movie(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const classes = useStyles();

    const { isUserAdmin, hasPermissionForEditMovies, hasPermissionForDeleteMovies } = useContext(AppContext);
    const [stateIsUserAdmin] = isUserAdmin;
    const [stateHasPermissionForEditMovies] = hasPermissionForEditMovies;
    const [stateHasPermissionForDeleteMovies] = hasPermissionForDeleteMovies;

    const [isVisibleStyle, setIsVisibleStyle] = useState(true);
    const history = useHistory();

    const onEditMovie = (e) => {
        e.preventDefault();
        setIsVisibleStyle(false);
        history.push(`${common.editMovieWithId}/${props.movieDataObj.movieData.id}`);
        props.onUserClickOnEditMovieCallback(props.movieDataObj.movieData.id);
    }
    const onDeleteMovie = async () => {
        let results = await movieUtils.deleteMovie(props.movieDataObj.movieData.id);
        if (results.isSuccess) {
            props.onUserClickOnDeleteMovieCallback(props.movieDataObj.movieData.id);
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
        <div >
            <form onSubmit={e => onEditMovie(e)}>
                <div className={`${visibleStyle}`}>
                    <Card style={{ width: '16rem' }}>
                        <Card.Img variant="top" src={props.movieDataObj.movieData.movie.image} alt={props.movieDataObj.movieData.movie.name} height="200" width="200" />
                        <Card.Body>
                            <Card.Title>{props.movieDataObj.movieData.movie.name} {new Array(props.movieDataObj.movieData.movie.premiered)[0].split("-")[0]}</Card.Title>
                            <Card.Text >

                                Genres:{new Array(props.movieDataObj.movieData.movie.genres).join(",")}


                            </Card.Text>

                        </Card.Body>
                    </Card>
                    <div className={classes.root}>
                        <Accordion component={'span'} >
                            <AccordionSummary component={'span'} variant={'body2'}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}><strong>Subscriptions watched</strong> </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box >
                                    <ListGroup>{props.movieDataObj.subscribedDataArray?.map((subscribedData, key) => {
                                        return <div key={key}>
                                            <ListGroup.Item key={key} ><NavLink key={key} to={`${common.allMembers}/${subscribedData.memberData.id}`} >{subscribedData.memberData.member.name} </NavLink>{subscribedData.date} </ListGroup.Item>
                                            <br />
                                        </div>
                                    })}</ListGroup>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                {
                    stateIsUserAdmin || stateHasPermissionForEditMovies ?
                        <Button type="submit" variant="outlined" color="primary" size="small" className={classes.margin}>Edit</Button>
                        : ""
                }
                {
                    stateIsUserAdmin || stateHasPermissionForDeleteMovies ?
                        <Button variant="outlined" color="primary" onClick={onDeleteMovie} size="small" className={classes.margin}>Delete</Button>
                        : ""
                }
                {errorMessage}
                <br />
            </form>
        </div >
    );
}
export default Movie;