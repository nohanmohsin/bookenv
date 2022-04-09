import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { Document, Page, pdfjs } from "react-pdf";
import { auth, db, storage } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

//idk why this exists tbh...it works tho...I aint touching this
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfHeight, setPdfHeight] = useState(500);
  const [scale, setScale] = useState(1.0);
  //the pdf file that is going to be displayed
  const [file, setFile] = useState();
  let { fileName } = useParams();
  const storageRef = ref(storage, `files/${fileName}`);
  const userDBRef = doc(db, "users", auth.currentUser.uid);
  useEffect(() => {
    //making the pdf bigger according to the screen size
    if(window.innerWidth > 1280){
      setPdfHeight(700)
    }
    //gets the link of the file in firebase storage
    getDownloadURL(storageRef)
    .then((url) => {
      //requesting the file from the storage
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = async (event) => {
        const blob = xhr.response;
        //setting the file to the response
        setFile((blob));
        const userUpdateDocRef = await updateDoc(userDBRef, {
          //only getting the fileId from the fileName as it contains ".pdf" file format
          //https://github.com/firebase/snippets-web/blob/1c4c6834f310bf53a98b3fa3c2e2191396cacd69/snippets/firestore-next/test-firestore/update_document_array.js#L8-L20
          bookHistory: arrayUnion(fileName.slice(0, 21))
        })
      };
      xhr.open('GET', url);
      xhr.send();

    })
    .catch((error) => {
      alert('sorry couldnt fetch the pdf for you at the moment');
    });
    // eslint-disable-next-line
  }, [])
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }
  function changePageBack() {
    changePage(-1);
  }
  function changePageNext() {
    changePage(+1);
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
        <p>
          {" "}
          Page {pageNumber} of {numPages}
        </p>
      </div>

      {pageNumber > 1 && (
        <button onClick={changePageBack}>Previous Page</button>
      )}
      {pageNumber < numPages && (
        <button onClick={changePageNext} className="next-page">
          Next Page
        </button>
      )}
      <button
        onClick={() => {
          setScale((prevScale) => prevScale + 0.3);
        }}
      >
        scale
      </button>
    </main>
  );
};

export default PdfRenderer;
