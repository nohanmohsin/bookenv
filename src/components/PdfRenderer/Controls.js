import React from "react";
import { auth } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import nextPageIcon from "../../icons/next-icon.svg";
import enlargeIcon from "../../icons/enlarge-icon.svg";
import minimizeIcon from "../../icons/minimize-icon.svg";

import BookmarkIcon from "../../icons/BookmarkIcon";

const Controls = ({
  pageNumber,
  setPageNumber,
  numPages,
  setScale,
  fileId,
  bookmarked,
  onBookmark,
  checkBookmark,
}) => {
  return numPages ? (
    <aside className="control-btns">
      {pageNumber > 1 && (
        <img
          src={nextPageIcon}
          alt=""
          //flipping the next Icon to be previous icon
          style={{ transform: "scaleX(-1)" }}
          onClick={() => {
            setPageNumber((prevPageNumber) => prevPageNumber - 1);
          }}
          width={30}
        />
      )}
      {pageNumber < numPages && (
        <img
          src={nextPageIcon}
          alt=""
          onClick={() => {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }}
          width={30}
        />
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
      <BookmarkIcon
        handleClick={onBookmark}
        color={bookmarked ? "#ffd675" : "#ffffff"}
      />
    </aside>
  ) : null;
};

export default Controls;
