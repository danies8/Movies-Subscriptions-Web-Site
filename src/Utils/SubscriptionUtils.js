import firebase from './FireBase';;

const getAllMembersSubscriptionData = async () => {
  try {
   let members = [];
    await firebase.firestore().collection("members").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        members.push({ id: doc.id, member: doc.data() });
      });
    });
    let subscriptions = [];
    await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        subscriptions.push({ id: doc.id, subscription: doc.data() });
      });
    });

    let movies = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        movies.push({ id: doc.id, movie: doc.data() });
      });
    });

     let membersDataArr = [];
    members.forEach((member, index) => {
      let memberDataObj = {};
      memberDataObj.memberData = member;
      subscriptions.forEach((subscriptionData, index) => {
        if (subscriptionData.subscription.memberId == member.id) {
          let subscribedMoviesArr = [];
          let subscribedMovies = subscriptionData.subscription.movies;
          subscribedMovies.forEach((subscribedMovie, index) => {
            let subscribedMovieObj = {};
            subscribedMovieObj.id = subscribedMovie.movieId;
            subscribedMovieObj.date = subscribedMovie.date;

            movies.forEach((movieData, index) => {
               if (movieData.id == subscribedMovie.movieId) {
                subscribedMovieObj.name = movieData.movie.name;
                subscribedMoviesArr.push(subscribedMovieObj);
              }
            });
            memberDataObj.moviesData = subscribedMoviesArr;
          });
        }
      });

      membersDataArr.push(memberDataObj);
    });
     return { isSuccess: true, membersDataArr: membersDataArr };

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}

const getMemberById = async (memberId) => {
  try {
     let members = [];
    await firebase.firestore().collection("members").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.id === memberId) {
          members.push({ id: doc.id, memberData: doc.data() });
        }
      });
    });

    return { isSuccess: true, member: members[0] };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const getAllMembersSubscriptionDataFilterByMemberId = async (memberId) => {
  try {

    let members = [];
    await firebase.firestore().collection("members").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.id == memberId) {
          members.push({ id: doc.id, member: doc.data() });
        }
      });
    });

    let subscriptions = [];
    await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.data().memberId == memberId) {
          subscriptions.push({ id: doc.id, subscription: doc.data() });
        }
      });
    });

    let movies = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        movies.push({ id: doc.id, movie: doc.data() });
      });
    });

     let membersDataArr = [];
    members.forEach((member, index) => {
      let memberDataObj = {};
      memberDataObj.memberData = member;
      subscriptions.forEach((subscriptionData, index) => {
         if (subscriptionData.subscription.memberId == member.id) {
          let subscribedMoviesArr = [];
          let subscribedMovies = subscriptionData.subscription.movies;
          subscribedMovies.forEach((subscribedMovie, index) => {
             let subscribedMovieObj = {};
            subscribedMovieObj.id = subscribedMovie.movieId;
            subscribedMovieObj.date = subscribedMovie.date;

            movies.forEach((movieData, index) => {
               if (movieData.id == subscribedMovie.movieId) {
                subscribedMovieObj.name = movieData.movie.name;
                subscribedMoviesArr.push(subscribedMovieObj);
              }
            });
            memberDataObj.moviesData = subscribedMoviesArr;
          });
        }
      });

      membersDataArr.push(memberDataObj);
    });
     return { isSuccess: true, membersDataArr: membersDataArr };

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}

const addMember = async (addMember) => {
  try {
    debugger;
    await firebase.firestore().collection("members").add({
      name: addMember.name,
      email: addMember.email,
      city: addMember.city,
    });

    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const updateMember = async (editMember) => {
  try {
      await firebase.firestore().collection("members").doc(editMember.id).update({
      name: editMember.name,
      email: editMember.email,
      city: editMember.city,
    });
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const deleteMember = async (memberId) => {
  try {
     let user = await firebase.firestore().collection("members").doc(memberId);
    user.delete();
     await firebase.firestore().collection("subscriptions").where("memberId", "==", memberId).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          let subscriptionsObj = await firebase.firestore().collection("subscriptions").doc(doc.id);
          subscriptionsObj.delete();
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

const subscirbeToNewMovie = async (newMovieDataObj, memberId) => {

  try {
    let filterMovie = [];
    await firebase.firestore().collection("movies").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.data().name === newMovieDataObj.name)
          filterMovie.push({ id: doc.id, movie: doc.data() });
      });
    });

    if (filterMovie.length > 0 && ! await isMemberSubscribed(memberId)) {
      let subscribtionObj = {};

      let subscribedMovieArr = [];
      let subscribedMovieObj = {};
      subscribedMovieObj.movieId = filterMovie[0].id;
      subscribedMovieObj.date = newMovieDataObj.premiered;
      subscribedMovieArr.push(subscribedMovieObj);
      subscribtionObj.movies = subscribedMovieArr;
      debugger;
      await firebase.firestore().collection("subscriptions").add({
        memberId: memberId,
        movies: subscribtionObj.movies
      });

    } else {
      let filterSubscription = [];
      await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().memberId === memberId)
            filterSubscription.push({ id: doc.id, subscription: doc.data() });
        });
      });

      let subscribtionObj = {};
      let subscribedMovieArr = [];
      let subscribedMovieObj = {};
      subscribedMovieObj.movieId = filterMovie[0].id;
      subscribedMovieObj.date = newMovieDataObj.premiered;
      subscribedMovieArr.push(subscribedMovieObj);
      subscribtionObj.movies = subscribedMovieArr;
      filterSubscription[0].subscription.movies.push(subscribedMovieObj);
debugger;
      await firebase.firestore().collection("subscriptions").doc(filterSubscription[0].id).update({
        movies: filterSubscription[0].subscription.movies
      });
    }

    return { isSuccess: true };

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const isMemberSubscribed = async (memberId) => {
  let subscriptions = [];
  await firebase.firestore().collection("subscriptions").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.data().memberId === memberId)
        subscriptions.push({ id: doc.id, subscription: doc.data() });
    });
  });
  return subscriptions.length > 0;
}
export default {
  getAllMembersSubscriptionData, getMemberById, getAllMembersSubscriptionDataFilterByMemberId, 
  addMember,updateMember, deleteMember,subscirbeToNewMovie
}

