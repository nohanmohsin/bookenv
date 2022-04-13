import React from "react";
import { auth } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import enlargeIcon from "../../icons/enlarge-icon.svg";
import minimizeIcon from "../../icons/minimize-icon.svg";

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
          next Page
        </button>
      )}

      <img
        src={enlargeIcon}
        alt=""
        onClick={() => {
          setScale((prevScale) => prevScale + 0.3);
        }}
        className="enlarge"
        width={30}
      />

      <img
        src={minimizeIcon}
        alt=""
        onClick={() => {
          setScale((prevScale) =>
            prevScale >= 1.3 ? prevScale - 0.3 : prevScale + 0
          );
        }}
        className="minimize"
        width={30}
      />
    </aside>
  );
};

export default Controls;
