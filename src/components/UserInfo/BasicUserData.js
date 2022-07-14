import { ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { auth, storage } from "../../firebase";

const BasicUserData = ({ userData }) => {
  const changeAvatar = async (e) => {
    e.preventDefault();
    const avatarFile=e.target.files[0];
    const fileExtension=avatarFile.name.split('.')[1];
    const storageRef = ref(storage, `avatars/${userData.uid}/${fileExtension}`)
    await uploadBytesResumable(storageRef, avatarFile);
    
  };
  return (
    <section className="username-and-avatar">
      <img
        src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
        width={300}
        alt=""
        onClick={changeAvatar}
      />
      {userData.uid === auth.currentUser.uid && (
        <>
          <div className="overlay" onClick={() => {
            document.getElementById('avatarInput').click();
          }}></div>
          <input type="file" name="" id="avatarInput" accept="image/png, image/jpeg" onChange={changeAvatar}/>
        </>
      )}
      <h1>{userData.userName}</h1>
    </section>
  );
};

export default BasicUserData;
