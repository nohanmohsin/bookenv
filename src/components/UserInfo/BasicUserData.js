import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { auth, db, storage } from "../../firebase";

const BasicUserData = ({ userData }) => {
  const [avatar, setAvatar] = useState(userData.avatarURL);
  const changeAvatar = async (e) => {
    if (e.target.files[0]) {
      const avatarFile = e.target.files[0];
      const fileName = crypto.randomUUID();
      const fileExtension = avatarFile.name.split(".")[1];
      const storageRef = ref(
        storage,
        `avatars/${fileName}.${fileExtension}`
      );
      await uploadBytesResumable(storageRef, avatarFile);
      const newAvatarURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, `users/${userData.uid}`), {
        avatarURL: newAvatarURL,
      });
      setAvatar(newAvatarURL);
    }
  };
  return (
    <section className="username-and-avatar">
      <img src={avatar} width={300} alt="" onClick={changeAvatar} />
      {userData.uid === auth.currentUser.uid && (
        <>
          <div
            className="overlay"
            onClick={() => {
              document.getElementById("avatarInput").click();
            }}
          ></div>
          <input
            type="file"
            name=""
            id="avatarInput"
            accept="image/png, image/jpeg"
            onChange={changeAvatar}
          />
        </>
      )}
      <h1>{userData.userName}</h1>
    </section>
  );
};

export default BasicUserData;
