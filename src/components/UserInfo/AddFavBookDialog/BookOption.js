import React from "react";

const BookOption = ({data, selectedBooks, setSelectedBooks}) => {

  return (
    <div
      className="book-option"
      onClick={() => {
        const newSelectedBooks = [...selectedBooks];
        newSelectedBooks.push(data.ID);
        
        setSelectedBooks(newSelectedBooks);
      }}
    >
      <img src={data.imageURL} alt="" />
      <span>{data.name}</span>
    </div>
  );
};

export default BookOption;
