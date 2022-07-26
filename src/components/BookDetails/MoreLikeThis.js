import React from "react";
import { Link } from "react-router-dom";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const MoreLikeThis = ({ moreBooks }) => {
  return (
    <section className="more-books">
      <h2>More Like This</h2>
      <div className="books">
        {moreBooks.length > 0 &&
          moreBooks.map((bookData) => (
            <Link to={`/${bookData.ID}`}>
              <BookBasicDetails data={bookData} />
            </Link>
          ))}
      </div>
    </section>
  );
};

export default MoreLikeThis;
