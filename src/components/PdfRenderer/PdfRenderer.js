import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";

import { auth, db, storage } from "../../firebase";
import {
  arrayUnion,
  doc,
  collection,
  runTransaction,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayRemove,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { Document, Page, pdfjs } from "react-pdf";

import Controls from "./Controls";
import crossIcon from "../../icons/cross-icon.svg";
//import exampleFile from "../../pdf.pdf";
import PageComments from "./PageComments/PageComments";
import Bookmarks from "./Bookmarks";

//idk why this exists tbh...it works tho...I aint touching this
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = () => {
  let navigate = useNavigate();
  //for the firebase data of the active book
  const [dbData, setDBData] = useState();
  const [bookmarks, setBookmarks] = useState([]);
  //number of total pages
  const [numPages, setNumPages] = useState(null);
  //currently opened page number
  const [pageNumber, setPageNumber] = useState(0);
  //for checking if the page is bookmarked or not
  const [bookmarked, setBookmarked] = useState(false);
  const [pdfHeight, setPdfHeight] = useState(500);
  const [scale, setScale] = useState(1.0);
  const [pageComments, setPageComments] = useState([]);
  //the pdf file that is going to be displayed
  const [file, setFile] = useState();
  const canvasRef = useRef();
  let { fileName, jumpPageNumber } = useParams();
  const bookID = fileName.slice(0, 20);
  const storageRef = ref(storage, `files/${fileName}`);
  const userDBRef = doc(db, "users", auth.currentUser.uid);
  //used for adding and fetching the data of the current book
  const bookDBRef = doc(db, `users/${auth.currentUser.uid}/books`, bookID);
  //check for bookmark on the currently opened page

  //gets the data for currently active book from db
  const getDBData = async () => {
    //https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef = doc(db, "books", bookID);
    const PageCommentQuery = query(
      collection(db, `books/${bookID}/pagecomments`),
      orderBy("createdAt"),
      limit(5)
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let pageCommentsDummy = [];
      setDBData(docSnap.data());
      //you can't fetch data from collections in a transaction
      const pageCommentsSnap = await getDocs(PageCommentQuery);
      if (pageCommentsSnap.docs.length > 0) {
        pageCommentsSnap.forEach((pageComment) => {
          pageCommentsDummy.push(pageComment.data());
        });
        setPageComments(pageCommentsDummy);
      }
    } else {
      navigate("/not-found");
    }
  };
  const checkBookmark = () => {
    bookmarks.includes(pageNumber) ? setBookmarked(true) : setBookmarked(false);
  };
  const handleBookmark = async () => {
    if (bookmarked) {
      await updateDoc(bookDBRef, {
        bookmarks: arrayRemove(pageNumber),
      });
      setBookmarks((prevBookmarks) => {
        return prevBookmarks.filter((pageNum) => pageNum !== pageNumber);
      });
    } else {
      await updateDoc(bookDBRef, {
        bookmarks: arrayUnion(pageNumber),
      });
      setBookmarks((prevBookmarks) => {
        return prevBookmarks ? [...prevBookmarks, pageNumber] : [pageNumber];
      });
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
        alert("sorry couldn't fetch the pdf for you at the moment");
      });

    // eslint-disable-next-line
  }, []);
  //checking for bookmark every time page is changed
  useEffect(() => {
    if (pageNumber > 0) {
      checkBookmark();
      if (jumpPageNumber) {
        jumpPageNumber > 0 && jumpPageNumber < numPages
          ? setPageNumber(jumpPageNumber)
          : navigate("/not-found");
      }
    }
  }, [pageNumber]);
  useEffect(() => {
    checkBookmark();
  }, [bookmarks]);
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
    await runTransaction(db, async (transaction) => {
      const bookExistence = await transaction.get(bookDBRef);
      if (bookExistence.exists()) {
        //adding bookmarks data saved earlier
        setBookmarks(bookExistence.data().bookmarks);
      } else {
        //will add data if the book hasn't already been read
        //doing this so that the pagesRead and bookmarks dont reset
        transaction.set(bookDBRef, {
          name: dbData.name,
          ID: bookID,
          imageURL: dbData.imageURL,
          pagesRead: 0,
          completed: false,
          genres: dbData.genres,
          timeStamp: serverTimestamp(),
          bookmarks: [],
        });
      }
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
          <Page
            pageNumber={pageNumber}
            height={pdfHeight}
            scale={scale}
            canvasRef={canvasRef}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>

      <p className="page-number">
        {" "}
        Page {pageNumber} of {numPages}
      </p>

      <img
        src={crossIcon}
        alt=""
        className="close"
        onClick={async () => {
          //TODO: use onbeforeunload to save pagesread too
          await updateDoc(bookDBRef, {
            pagesRead: pageNumber,
            completed: pageNumber === numPages ? true : false,
            timeStamp: serverTimestamp(),
          });
          sessionStorage.clear();
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
        fileID={bookID}
        bookmarked={bookmarked}
        onBookmark={handleBookmark}
        checkBookmark={checkBookmark}
        canvas={canvasRef}
      />
      <div className="bookmarks-and-comments">
        <Bookmarks
          bookmarkedPages={bookmarks}
          file={file}
          setPageNumber={setPageNumber}
        />
        <PageComments
          pageNum={pageNumber}
          data={pageComments}
          bookID={bookID}
        />
      </div>
    </main>
  );
};

export default PdfRenderer;
