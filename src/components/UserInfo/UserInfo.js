import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";

const UserInfo = () => {
  const [userData, setUserData] = useState();
  let { uid } = useParams();
  useEffect(() => {
    const getUserData = async () => {
      const userSnap = await getDoc(doc(db, `users/${uid}`));
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        console.log(userSnap.data());
      } else {
        alert("Wrong link or user ID");
      }
    };
    getUserData();
  }, []);
  return userData ? (
    <main className="user-info navbar-included">
      <h1>{userData.userName}</h1>
    </main>
  ) : (
    <p>Loading...</p>
  );
};

export default UserInfo;
