import React from "react";
import { auth } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const Controls = ({
  pageNumber,
  setPageNumber,
  numPages,
  setScale,
  fileId,
}) => {
  
  return (
    <aside className="control-btns">
      {pageNumber > 1 && (
        <button
          onClick={() => {
            setPageNumber((prevPageNumber) => prevPageNumber - 1);
          }}
        >
          Previous Page
        </button>
      )}
      {pageNumber < numPages && (
        <button
          onClick={() => {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }}
          className="next-page"
        >
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
      <button
        onClick={() => {
          setScale((prevScale) =>
            prevScale >= 1.3 ? prevScale - 0.3 : prevScale + 0
          );
        }}
      >
        Scale Down
      </button>

    </aside>
  );
};

export default Controls;
