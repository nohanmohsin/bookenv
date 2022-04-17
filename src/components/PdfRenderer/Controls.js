import React from "react";
import { auth } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import nextPageIcon from "../../icons/next-icon.svg";
import enlargeIcon from "../../icons/enlarge-icon.svg";
import minimizeIcon from "../../icons/minimize-icon.svg";
import BookmarkIcon from "../../icons/BookmarkIcon";
import shareIcon from "../../icons/share-icon.svg";
import downloadIcon from "../../icons/download-icon.svg";
import { Link } from "react-router-dom";

const Controls = ({
  pageNumber,
  setPageNumber,
  numPages,
  setScale,
  fileID,
  bookmarked,
  onBookmark,
  checkBookmark,
  canvas,
}) => {
  const downloadImage = (blob) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileID;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  };
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
      <img src={shareIcon} alt="" width={30} className="share" onClick={() => {
        //TODO: change this to the hosted url when website is hosted
        navigator.clipboard.writeText(`http://localhost:3000/view=${fileID}.pdf/page=${pageNumber}`)
        alert("Link copied to clipboard")
      }}/>
      <img
        src={downloadIcon}
        alt=""
        width={30}
        className="download"
        onClick={async () => {
          const canvasData = await html2canvas(document.querySelector(".react-pdf__Page__canvas"));
          const image = canvasData.toDataURL("'image/png");
          downloadImage(image);
        }}
      />
    </aside>
  ) : null;
};

export default Controls;
