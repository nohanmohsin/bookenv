import React from "react";

const AddFavBookDialog = ({ addFavBookRef, userData, allBooks }) => {
  const addFavBook = async (e) => {
    e.preventDefault();

  };
  return (
    <dialog className="add-fav-book" ref={addFavBookRef}>
      <select name="book-selection" multiple>
        {allBooks.map((book) => (
          <option value={book.ID}>
              <img src={book.imageURL} alt="" />
              <span>{book.name}</span>
          </option>
        ))}
      </select>
      <button type="submit"></button>
    </dialog>
  );
};

export default AddFavBookDialog;
