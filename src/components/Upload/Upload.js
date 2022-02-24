import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import bookwall from "../../illustrations/bookwall.svg";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [uploadTask, setUploadTask] = useState();
  const [fileName, setFileName] = useState();
  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[1].files[0];
    const storageRef = ref(storage, `files/${file.name}`);
    let tempTask = uploadBytesResumable(storageRef, file);
    setUploadTask(tempTask);
  };

  useEffect(() => {
    if (uploadTask) {
      //https://firebase.google.com/docs/reference/js/v8/firebase.storage.UploadTask
      uploadTask.on(
        "state_changed",
        //setting loading to true while the file upload is pending
        (snapshot) => {
          //to keep the upload button disabled till the upload is completed
          setLoading(true);
          console.log(snapshot.bytesTransferred / snapshot.totalBytes);
        },
        //function for error
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              alert("something went wrong while uploading this file :(");
              setLoading(false);
              break;
            case "storage/canceled":
              // User canceled the upload
              console.log("the cancel method works");
              
              break;
            default:
              alert("something went wrong while uploading this file :(");
              setLoading(false);
          }
        },
        //function for successful completion
        () => {
          setLoading(false);
          console.log("the upload is successful");
        }
      );
    }
  }, [uploadTask]);
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
          <input type="file" className="input" id="file-upload" onChange={(e) => {
            setFileName(e.target.files[0].name)
          }} required />
          Upload the book here
        </label>
        <div className="buttons-container">
          <button disabled={loading} type="submit" className="upload">
            Upload
          </button>
          {loading === true ? (
            <button className="cancel" onClick={() => {
              uploadTask.cancel()
              setLoading(false)
            }}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <img src={bookwall} alt="a wall full of books" className="bookwall" />
    </main>
  );
};

export default Upload;
