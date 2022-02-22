import React, { useState } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import bookwall from "../../illustrations/bookwall.svg";

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
      <form onSubmit={formHandler} className="upload-form">
        <h1>
          Add a new book for <br /> Everyone to read!
        </h1>
        <input
          type="text"
          className="gbooks-link"
          placeholder="Google Books Link"
          required
        />
        <label className="file-input-label">
          <input type="file" className="input" id="file-upload" required />
          Upload the book here
        </label>

        <button disabled={loading} type="submit">
          Upload
        </button>
      </form>
      <img src={bookwall} alt="a wall full of books" className="bookwall"/>
      
    </main>
  );
};

export default Upload;
