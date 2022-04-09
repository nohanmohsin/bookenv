import React from "react";

const BookBasicDetails = ({ data }) => {
  return (
    <div className="book-basic-details">
      <img src={data.imageURL} alt="book cover"/>
      <span>
        {data.name}
      </span>
    </div>
  );
};

export default BookBasicDetails;
