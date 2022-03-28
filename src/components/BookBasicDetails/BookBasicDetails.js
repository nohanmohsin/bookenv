import React from "react";

const BookBasicDetails = ({ data }) => {
  return (
    <div className="book-basic-details">
      <img src={data.imageURL} alt="book cover" width={100}/>
      <span>
        {data.name}
      </span>
    </div>
  );
};

export default BookBasicDetails;
