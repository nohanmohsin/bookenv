import React from "react";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import { Link } from "react-router-dom";

const Shelf = ({ shelf, setShelfID, setBookData, addBookRef }) => {
  return (
    <section className="shelf">
      <div className="headline-and-icons-container">
        <h1>{shelf.shelfName}</h1>
        <img
          src={addIcon}
          alt=""
          className="add-icon"
          width={45}
          onClick={() => {
            addBookRef.current.showModal();
            setShelfID(shelf.shelfID);
          }}
        />
      </div>
      {/* mapping through the books from the individual shelf we get from db data */}
      <div className="books">
        {shelf.books.map((book) => (
          <div className="book-container">
            <Link to={`/${book.id}`}>
              <BookBasicDetails data={book} />
            </Link>
            <div
              className="remove-book"
              onClick={() => {
                setShelfID(shelf.shelfID);
                setBookData(book);
                //modal opens in useEffect of bookData
              }}
            >
              <div className="presentation"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shelf;
