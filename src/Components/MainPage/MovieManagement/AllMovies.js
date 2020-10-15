import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Route, Switch } from "react-router-dom";
import { makeStyles, Paper, Grid } from '@material-ui/core';
import LazyLoad from 'react-lazyload'; 

import EditMovie from './EditMovie';
import Movie from './Movie.js';
import { AppContext } from '../../../AppContext';
import moviesUtils from '../../../Utils/MovieUtils.js';
import common from '../../../Utils/Common';
import './AllMovies.css';

const Loading = () =>{
  return <div >
      <h5>Loading...</h5>
  </div>
};


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
    
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
 
}));


function AllMovies(props) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");

  const [moviesDataArr, setMoviesDataArr] = useState([]);
  const history = useHistory();

  const { filterMovieName } = useContext(AppContext);
  const [stateFilterMovieName, setFilterMovieName] = filterMovieName;

   useEffect(() => {
    async function getAllMoviesData() {
      let moviesDataArr;

      let movieName = props.match.params.movieName;
      // Case of members's subscriptions
      if (movieName != undefined && movieName != "") {
        let results = await moviesUtils.getAllMoviesFilterByMovieName(movieName, true);
        if (results.isSuccess) {
          moviesDataArr = results.moviesDataArr;
          setFilterMovieName("");
        }
        else {
          setErrorMessage(results.errorMessage);
        }
      }
      // Case of get all movies
      else if (stateFilterMovieName == "") {
        let results = await moviesUtils.getAllMovies();
        if (results.isSuccess) {
          setFilterMovieName(false);
          moviesDataArr = results.moviesDataArr;
        }
        else {
          setErrorMessage(results.errorMessage);
        }
      }
      // Case of filter all movies
      else {
        let results = await moviesUtils.getAllMoviesFilterByMovieName(stateFilterMovieName, false);
        if (results.isSuccess) {
          setFilterMovieName("");
          moviesDataArr = results.moviesDataArr;
        }
        else {
          setErrorMessage(results.errorMessage);
        }
      }
      setMoviesDataArr(moviesDataArr);
    }
    getAllMoviesData();
  }, []);

  const onUserClickOnEditMovie = (movieId) => {
    setMoviesDataArr([]);
    history.push(`${common.editMovieWithId}/${movieId}`);
  }

  const onUserClickOnDeleteMovie = (movieId) => {
    let child = document.getElementById (movieId);
    let parent =document.getElementById('gridMovies');
    parent.removeChild(child);
  }

  return (
    <div >
      <Grid container spacing={4} id="gridMovies">
      { moviesDataArr?.map((movieDataObj, key) => {
       return <Grid  id={movieDataObj.movieData.id} item key={key} xs={4}>
          <Paper className={classes.paper}> 
          <LazyLoad key={key} placeholder={<Loading/>}>
          <Movie  key={key} movieDataObj={movieDataObj} 
          onUserClickOnEditMovieCallback={(movieId) => { onUserClickOnEditMovie(movieId) }}
          onUserClickOnDeleteMovieCallback={(movieId) => { onUserClickOnDeleteMovie(movieId) }} />
          </LazyLoad>
          </Paper>
        </Grid>
         })}
      </Grid>
      {errorMessage}
      <Switch>
        <Route path={common.reload} component={null} key="reload" />
        <Route exact path={`${common.editMovie}`} component={EditMovie} />

      </Switch>
    </div>
  );
}
export default AllMovies;
