import React from "react";

const BookBasicDetails = ({ data }) => {
  const bgImageURL = data.backgroundImage;
  return (
    <div className="book-basic-details">
      <img src={bgImageURL} alt="book cover" />
      <span>
        {data.name}{" "} ({data.publishDate})
      </span>
    </div>
  );
};

export default BookBasicDetails;
