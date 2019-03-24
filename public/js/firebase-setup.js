import {checkUserStatus} from './login.js';

const firebaseConfig = {
  apiKey: "AIzaSyA6I-2TZCD6IcmGvjTc8uI-LGA7liHMvI8",
  authDomain: "hacklocal.firebaseapp.com",
  databaseURL: "https://hacklocal.firebaseio.com",
  projectId: "hacklocal",
  storageBucket: "hacklocal.appspot.com",
  messagingSenderId: "1026550190494"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.auth().onAuthStateChanged((user) => {
  checkUserStatus(user);
});
