//code shamelessly copied from a youtube tutorial
import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();
  function signup(username, email, password) {
    createUserWithEmailAndPassword(auth, email, password)

    //changing the display name of the user after creating user
    .then(async (res) => {
      await updateProfile(auth.currentUser, {
        displayName: username ? username : res.user.uid
      })
      //adding the user data to the database
      const userDocRef= await setDoc(doc(db, "users", auth.currentUser.uid), {
        userName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        threads: []
      })
      //if the user is created successfully only then we navigate them to their news feed
      navigate('/')
    })
    .catch((err) => {
      setCurrentUser(null)
      if(err.code === 'auth/email-already-in-use'){
        alert('Email already in use');
      }
      else{
        alert("Failed to create an account")
      }
    })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logOut() {
    signOut(auth)
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logOut,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
