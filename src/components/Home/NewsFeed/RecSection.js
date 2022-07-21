import React from "react";
import { Link } from "react-router-dom";
import BookBasicDetails from "../../BookBasicDetails/BookBasicDetails";

const RecSection = ({ booksDataArr, title }) => {
  return (
    <>
      {booksDataArr && (
        <>
          <h2>{title}</h2>
          <div className="books">
            {booksDataArr.map((book) => (
              <Link to={`/${book.ID}`}>
                <BookBasicDetails data={book} />
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default RecSection;
