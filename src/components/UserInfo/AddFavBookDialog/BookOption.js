import React, { useState } from "react";

const BookOption = ({data, selectedBooks, setSelectedBooks}) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={`book-option ${selected ? 'selected': ''}`}
      onClick={() => {
        const newSelectedBooks = [...selectedBooks];
        newSelectedBooks.push(data.ID);
        setSelected(!selected)
        setSelectedBooks(newSelectedBooks);
      }}
    >
      <img src={data.imageURL} alt="" />
      <span>{data.name}</span>
    </div>
  );
};

export default BookOption;
