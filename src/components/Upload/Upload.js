import React, { useState } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

const Upload = () => {
  
  const [loading, setLoading] = useState(false);
  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFile(file);
  };

  const uploadFile = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    //https://firebase.google.com/docs/reference/js/v8/firebase.storage.UploadTask
    uploadTask.on(
      "state_changed",
      //setting loading to true while the file upload is pending
      (snapshot) => {
        //to keep the upload button disabled till the upload is completed
        setLoading(true);
      },
      //function for error
      (error) => {
        alert(
          "Something went wrong while uploading this file :( Try again later"
        );
        setLoading(false);
      },
      //function for successful completion 
      () => {
        setLoading(false);
      }
    );
  };
  return (
    <main className="upload">
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <button disabled={loading} type="submit">
          Upload
        </button>
      </form>
    </main>
  );
};

export default Upload;
