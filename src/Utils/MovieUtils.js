import firebase from './FireBase';;

const getAllMovies = async () => {
  try {
   let movies = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        movies.push({ id: doc.id, movie: doc.data() });
      });
    });

    let subscriptions = [];
    await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        subscriptions.push({ id: doc.id, subscription: doc.data() });
      });
    });

     let members = [];
    await firebase.firestore().collection("members").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        members.push({ id: doc.id, member: doc.data() });
      });
    });

     let moviesDataArr = [];
    movies.forEach((movie, index) => {

      let movieDataObj = {};
      movieDataObj.movieData = movie;

      let subscribedDataArray = [];
      subscriptions.forEach((subscriptionObj1, index) => {
        let subscribedDataObj = {};
        let subscribedMovies = subscriptionObj1.subscription.movies;

        subscribedMovies.forEach((subscribedMovie, index) => {
          if (subscribedMovie.movieId == movie.id) {

            subscribedDataObj.date = subscribedMovie.date;

            subscriptions.forEach((subscriptionObj2, index) => {
              if (subscriptionObj2.id == subscriptionObj1.id) {
                 members.forEach((member, index) => {
                  if (member.id == subscriptionObj2.subscription.memberId) {
                     subscribedDataObj.memberData = member;
                  }
                });
                subscribedDataArray.push(subscribedDataObj);
              }

            });
          }
        });
      });
      movieDataObj.subscribedDataArray = subscribedDataArray;
      moviesDataArr.push(movieDataObj);
    });
    return { isSuccess: true, moviesDataArr: moviesDataArr };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const getAllMoviesFilterByMovieName = async (movieName, isExactFilter) => {

  try {
   let moviesDataArr = [];
    let filterdMovies = [];
    if (isExactFilter) {
      await firebase.firestore().collection("movies").where("name", "==", movieName).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          filterdMovies.push({ id: doc.id, movie: doc.data() });
        });
      });
    }
    else {
      await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().name.toLowerCase().includes(movieName.toLowerCase())) {
            filterdMovies.push({ id: doc.id, movie: doc.data() });
          }
        });
      });
    }

    if (filterdMovies.length == 0) {
      return { isSuccess: true, moviesDataArr: moviesDataArr };
    }

     let subscriptions = [];
    await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        subscriptions.push({ id: doc.id, subscription: doc.data() });
      });
    });

     let members = [];
    await firebase.firestore().collection("members").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        members.push({ id: doc.id, member: doc.data() });
      });
    });

    filterdMovies.forEach((filterdMovie, index) => {

      let movieDataObj = {};
      movieDataObj.movieData = filterdMovie;

      let subscribedDataArray = [];
      subscriptions.forEach((subscriptionObj1, index) => {
        let subscribedDataObj = {};
        let subscribedMovies = subscriptionObj1.subscription.movies;

        subscribedMovies.forEach((subscribedMovie, index) => {
          if (subscribedMovie.movieId == filterdMovie.id) {

            subscribedDataObj.date = subscribedMovie.date;

            subscriptions.forEach((subscriptionObj2, index) => {
              if (subscriptionObj2.id == subscriptionObj1.id) {
                 members.forEach((member, index) => {
                  if (member.id == subscriptionObj2.subscription.memberId) {
                     subscribedDataObj.memberData = member;
                  }
                });
                subscribedDataArray.push(subscribedDataObj);
              }

            });
          }
        });
      });
      movieDataObj.subscribedDataArray = subscribedDataArray;
      moviesDataArr.push(movieDataObj);
    });
    return { isSuccess: true, moviesDataArr: moviesDataArr };
  }

  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const getMovieById = async (movieId) => {
  try {
     let movies = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.id === movieId) {
          movies.push({ id: doc.id, movieData: doc.data() });
        }
      });
    });

    return { isSuccess: true, movie: movies[0] };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const getAllMoviesNames = async () => {
  try {
    let movies = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        movies.push({ id: doc.id, moviesData: doc.data() });
      });
    });
    let moviesNames = movies.map(movie => movie.moviesData.name);
    return { isSuccess: true, moviesNames: moviesNames };
  }

  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const addMovie = async (addMovie) => {
  try {
    await firebase.firestore().collection("movies").add({
      name: addMovie.name,
      genres: addMovie.genres,
      image: addMovie.image,
      premiered: addMovie.premiered,
    });

    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const updateMovie = async (editMovie) => {
  try {
     await firebase.firestore().collection("movies").doc(editMovie.id).update({
      name: editMovie.name,
      genres: editMovie.genres,
      image: editMovie.imageUrl,
      premiered: editMovie.premiered,
    });
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const deleteMovie = async (movieId) => {
  try {
    let movie = await firebase.firestore().collection("movies").doc(movieId);
    movie.delete();

    await firebase.firestore().collection("subscriptions").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
           let subscribedMovies = doc.data().movies;
          subscribedMovies.forEach(async (subscribedMovie, index) => {
            if (subscribedMovie.movieId === movieId) {
               let subscriptionsObj = await firebase.firestore().collection("subscriptions").doc(doc.id);
              subscriptionsObj.delete()
            }
          });

        });
      })
      .catch(function (error) {
        throw error;
      });

    return { isSuccess: true };
  }

  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

export default {
  getAllMovies, getAllMoviesFilterByMovieName, getMovieById, getAllMoviesNames,
  addMovie,updateMovie, deleteMovie
}

