import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import BookOption from "./BookOption";

const AddFavBookDialog = ({ addFavBookRef, userData, allBooks }) => {
  const [selectedBooks, setSelectedBooks] = useState([]);
  let { uid } = useParams();
  let favExcludedBooks = [];
  if (userData.favBooks) {
    favExcludedBooks = allBooks.filter(
      (book) => !userData.favBooks.includes(book.ID)
    );
  }

  const addFavBook = async () => {
    if (selectedBooks.length > 0) {
      let newFavBooks = [];
      allBooks
        .filter((book) => selectedBooks.includes(book.ID))
        .forEach((book) => newFavBooks.push(book.ID));
    
      await updateDoc(doc(db, `users/${uid}`), {
        favBooks: arrayUnion(...newFavBooks),
      }).catch((err) => alert("An unexpected error occured"));
      addFavBookRef.current.close();
    } else {
      alert("add a book first");
    }
  };
  return (
    <dialog className="add-fav-book" ref={addFavBookRef}>
      <div className="info-container">
        <div className="book-selection">
          {userData.favBooks ? (
            favExcludedBooks.length > 0 ? (
              favExcludedBooks.map((book) => (
                <BookOption
                  data={book}
                  selectedBooks={selectedBooks}
                  setSelectedBooks={setSelectedBooks}
                />
              ))
            ) : (
              <span>There are no Books left to Favorite</span>
            )
          ) : (
            allBooks.map((book) => (
              <BookOption data={book} selectedBooks={selectedBooks} setSelectedBooks={setSelectedBooks} />
            ))
          )}
        </div>
        {favExcludedBooks.length > 0 && (
          <button onClick={addFavBook}>Add Books</button>
        )}
      </div>
    </dialog>
  );
};

export default AddFavBookDialog;
