import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { Document, Page, pdfjs } from "react-pdf";
import { auth, db, storage } from "../../firebase";
import {
  arrayUnion,
  doc,
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
} from "firebase/firestore";
import Controls from "./Controls";
import crossIcon from "../../icons/cross-icon.svg";
import exampleFile from "../../pdf.pdf";
import PageComments from "./PageComments";

//idk why this exists tbh...it works tho...I aint touching this
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = () => {
  let navigate = useNavigate();
  //for the firebase data of the active book
  const [dbData, setDBData] = useState();
  //number of total pages
  const [numPages, setNumPages] = useState(null);
  //currently opened page number
  const [pageNumber, setPageNumber] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [pdfHeight, setPdfHeight] = useState(500);
  const [scale, setScale] = useState(1.0);
  //the pdf file that is going to be displayed
  const [file, setFile] = useState();
  let { fileName } = useParams();
  const bookID = fileName.slice(0, 20);
  const storageRef = ref(storage, `files/${fileName}`);
  const userDBRef = doc(db, "users", auth.currentUser.uid);
  //used for adding the book to users read books history
  const bookDBRef = doc(db, `users/${auth.currentUser.uid}/books`, bookID);
  //check for bookmark on the currently opened page

  //gets the data for currently active book from db
  const getDBData = async () => {
    //https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef = doc(db, "books", bookID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDBData({...docSnap.data(), bookmarks: []});
    } else {
      navigate("/not-found");
    }
  };
  const checkBookmark = () => {
    console.log(pageNumber);
    // console.log(dbData.bookmarks.includes(pageNumber + 1))
    dbData.bookmarks.includes(pageNumber)
      ? setBookmarked(true)
      : setBookmarked(false)
  };
  const handleBookmark = async () => {
    if (bookmarked) {
      const pageIndex = dbData.bookmarks.indexOf(pageNumber);
      await updateDoc(bookDBRef, {
        bookmarks: arrayRemove(pageNumber)
      });
      dbData.bookmarks.splice(pageIndex);
      checkBookmark();
    } else {
      await updateDoc(bookDBRef, {
        bookmarks: arrayUnion(pageNumber),
      });
      dbData.bookmarks.push(pageNumber);
      checkBookmark();
      console.log(dbData.bookmarks);
      console.log(bookmarked);
    }
  };
  useEffect(() => {
    getDBData();
    //making the pdf bigger according to the screen size
    if (window.innerWidth > 1280) {
      setPdfHeight(700);
    }

    //gets the link of the file in firebase storage
    getDownloadURL(storageRef)
      .then((url) => {
        //requesting the file from the storage
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = async (event) => {
          const blob = xhr.response;
          //setting the file to the response
          setFile(blob);
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((error) => {
        alert("sorry couldnt fetch the pdf for you at the moment");
      });
    
    // eslint-disable-next-line
  }, []);
  //checking for bookmark every time page is changed
  useEffect(() => {
    if(pageNumber > 0){
      checkBookmark();
    }
    
  }, [pageNumber])
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 37:
          changePageBack();
          break;
        case 39:
          changePageNext();
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    //removing the listener after component unmounts
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  async function onDocumentLoadSuccess({ numPages }) {
    const addBookRef = await setDoc(bookDBRef, {
      name: dbData.name,
      ID: bookID,
      imageURL: dbData.imageURL,
      pagesRead: 0,
      timeStamp: serverTimestamp(),
      bookmarks: [],
    });
    setNumPages(numPages);
    setPageNumber(1);
  }
  async function changePageBack() {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
      
    }
    return null;
  }
  function changePageNext() {
    if (pageNumber < numPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      
    }
    return null;
  }

  return (
    <main className="pdf-renderer">
      <div className="pdf-container">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={console.error()}
          className="pdf-doc"
        >
          <Page pageNumber={pageNumber} height={pdfHeight} scale={scale} />
        </Document>
      </div>
      <p>
        {" "}
        Page {pageNumber} of {numPages}
      </p>

      <img
        src={crossIcon}
        alt=""
        className="close"
        onClick={async () => {
          //TODO: use onbeforeunload to save pagesread too
          const updatePagesReadRef = await updateDoc(bookDBRef, {
            pagesRead: pageNumber,
            timeStamp: serverTimestamp(),
          });
          navigate("/home");
        }}
        width={40}
        height={40}
      />

      {/* sorry 😭 it's 1 am */}
      <Controls
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        numPages={numPages}
        setScale={setScale}
        fileId={bookID}
        bookmarked={bookmarked}
        onBookmark={handleBookmark}
        checkBookmark={checkBookmark}
      />
      <PageComments fileId={bookID} />
    </main>
  );
};

export default PdfRenderer;
