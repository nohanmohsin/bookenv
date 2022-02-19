import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import {getStorage} from 'firebase/storage';

const app = firebase.initializeApp({
  apiKey: "AIzaSyBW9FuBuMUCkTESCXNtK0o9h3d3TXgdkYA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "gs://bookenv-dev.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})

export const auth = app.auth()
export default app
export const storage = getStorage(app);