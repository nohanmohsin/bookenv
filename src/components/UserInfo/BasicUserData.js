import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { auth, db, storage } from "../../firebase";

const BasicUserData = ({ userData, setUserData }) => {
  const [avatar, setAvatar] = useState(userData.avatarURL);
  const changeAvatar = async (e) => {
    if (e.target.files[0]) {
      const avatarFile = e.target.files[0];
      const fileName = crypto.randomUUID();
      const fileExtension = avatarFile.name.split(".")[1];
      const fileSize = avatarFile.size / 1024 / 1024;
      const storageRef = ref(storage, `avatars/${fileName}.${fileExtension}`);
      const oldAvatarRef = ref(
        storage,
        `avatars/${avatar.substring(
          avatar.indexOf("avatars%2F") + 10,
          avatar.indexOf("?")
        )}`
      );
      if (fileSize <= 3) {
        if (sessionStorage.avatarUpdateCounter === 3) {
          alert(
            "you have already updated your avatar 3 times. You can change it again 30 minutes later"
          );
          return;
        }
        deleteObject(oldAvatarRef)
        await uploadBytesResumable(storageRef, avatarFile);
        const newAvatarURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, `users/${userData.uid}`), {
          avatarURL: newAvatarURL,
        });
        setAvatar(newAvatarURL);
        if (sessionStorage.avatarUpdateCounter) {
          sessionStorage.avatarUpdateCounter =
            Number(sessionStorage.avatarUpdateCounter) + 1;
        } else {
          sessionStorage.avatarUpdateCounter = 1;
        }
      } else {
        alert("your file cannot exceed 3MB");
      }
    }
  };
  const changeUserName = async (e) => {
    const newUserName = e.currentTarget.textContent;
    if (newUserName !== userData.userName) {
      await updateDoc(doc(db, `users/${userData.uid}`), {
        userName: newUserName,
      });
      setUserData({ ...userData, userName: newUserName });
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
      <h1
        contentEditable={userData.uid === auth.currentUser.uid ? true : false}
        onBlur={changeUserName}
        onKeyDown={(e) => {
          let allowedKeys = false;
          allowedKeys =
            e.key === "Backspace" /* BACKSPACE */ ||
            e.key === "Escape" /* END */ ||
            e.key === "PageUp" /* HOME */ ||
            e.key === "ArrowLeft" /* LEFT */ ||
            e.key === "ArrowUp" /* UP */ ||
            e.key === "ArrowRight" /* RIGHT*/ ||
            e.key === "ArrowDown" /* DOWN */ ||
            e.key === "Delete" /* DEL*/ ||
            (e.ctrlKey === true && e.key === "A") /* CTRL + A */ ||
            (e.ctrlKey === true && e.key === "X") /* CTRL + X */ ||
            (e.ctrlKey === true && e.key === "C") /* CTRL + C */ ||
            (e.ctrlKey === true && e.key === "V") /* CTRL + V */ ||
            (e.ctrlKey === true && e.key === "Z") /* CTRL + Z */;
          if (!allowedKeys && e.currentTarget.textContent.length >= 30) {
            e.preventDefault();
          }
        }}
      >
        {userData.userName}
      </h1>
    </section>
  );
};

export default BasicUserData;
