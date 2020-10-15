import firebase from 'firebase';

const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_KEY,
   authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
   projectId: "movies-subscriptions-web-728af", //must be string
   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BACKET,
   messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
   appId: process.env.REACT_APP_FIREBASE_APP_ID,
   measurementId: process.env.REACT_APP_FIREBASE_MESUREMENT_ID

};
firebase.initializeApp(firebaseConfig);

export default firebase;