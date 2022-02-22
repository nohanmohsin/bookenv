import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { Document, Page, pdfjs } from "react-pdf";
import { storage } from "../../firebase";

//idk why this exists tbh...it works tho...I aint touching this
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfRenderer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  //the pdf file that is going to be displayed
  const [file, setFile] = useState();
  let { fileName } = useParams();
  const storageRef = ref(storage, `files/${fileName}`);
  useEffect(() => {
    

    //gets the link of the file in firebase storage
    
    getDownloadURL(storageRef)
    .then((url) => {
      //requesting the file from the storage
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        //setting the file to the response
        setFile((blob));
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
    <main className="pdf-container">
      {
        file ? 
        <>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error()}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            {" "}
            Page {pageNumber} of {numPages}
          </p>
          {pageNumber > 1 && (
            <button onClick={changePageBack}>Previous Page</button>
          )}
          {pageNumber < numPages && (
            <button onClick={changePageNext}>Next Page</button>
          )}
        </>
          
      :
      <p>loading...</p>
      }
      
    </main>
  );
};

export default PdfRenderer;
