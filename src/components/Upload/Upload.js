import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { db } from "../../firebase";
import { storage } from "../../firebase";
import bookwall from "../../illustrations/bookwall.svg";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();
  //used to remove selected file from file input after upload
  const fileInputRef = useRef();
  //state for upload task
  const [uploadTask, setUploadTask] = useState();
  const formHandler = (e) => {
    e.preventDefault();
    const booksLinkRef = e.target[0].value;
    let usableLink = booksLinkRef.substr(booksLinkRef.indexOf("id") + 3, 12);
    if (
      booksLinkRef.startsWith("https://books.google.com") &&
      booksLinkRef.indexOf("id=") !== -1
    ) {
      //fetching the data related to the uploaded book from google books api
      fetch(`https://www.googleapis.com/books/v1/volumes/${usableLink}`)
        .then((res) => res.json())
        .then(async (data) => {
          try {
            //uploading the book data from google books to the database
            const docRef = await addDoc(collection(db, "books"), {
              name: data.volumeInfo.title,
              //used for searching(half text search)
              nameIndices: data.volumeInfo.title.split(" "),
              author: data.volumeInfo.authors,
              genres: data.volumeInfo.categories[0],
              publishDate: data.volumeInfo.publishedDate,
              pageCount: data.volumeInfo.pageCount,
              description: data.volumeInfo.description,
              imageURL: data.volumeInfo.imageLinks.thumbnail,
              //TODO: check reviews with docSnap.exists() instead
              reviewAdded: false
            });

            //uploading the file to storage after adding the data from the api to db
            const file = e.target[1].files[0];
            const storageRef = ref(storage, `files/${docRef.id}.pdf`);
            let tempTask = uploadBytesResumable(storageRef, file);
            setUploadTask(tempTask);
          } catch (err) {
            //no need to alert here cos the upload Task gets cancelled here
            //cancelling the upload because the book data couldn't be added to the db
            uploadTask.cancel();
            setLoading(false);
          }
        })
        .catch((err) => {
          uploadTask.cancel();
          alert("something went wrong while uploading this file :(");
          setLoading(false);
        });
    } else {
      alert("Your Link is invalid");
      e.target[0].value = "";
    }
  };
  //monitoring the uploadTask
  useEffect(() => {
    if (uploadTask) {
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
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              alert("something went wrong while uploading this file :(");
              setLoading(false);
              break;
            //not alerting when the user has cancelled the upload
            case "storage/cancelled":
              setLoading(false);
              break;
            default:
              alert("something went wrong while uploading this file :(");
              setLoading(false);
          }
        },
        //function for successful completion
        () => {
          //removing file name from input label after upload
          setFileName("");
          //changing the value to remove the file that has finished being uploaded
          fileInputRef.current.value = "";
          setLoading(false);
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
          <input
            type="file"
            className="input"
            id="file-upload"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => {
              if(e.target.files[0].name.includes("pdf")){
                setFileName(e.target.files[0].name);
              } else {
                alert("Wrong File...Check again")

              }
            }}
            required
          />
          {fileName ? <>{fileName}</> : <>Upload the book here</>}
        </label>
        <div className="buttons-container">
          <button disabled={loading} type="submit" className="upload">
            Upload
          </button>
          {loading === true ? (
            <button
              className="cancel"
              onClick={() => {
                uploadTask.cancel();
                setLoading(false);
              }}
            >
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
