import { arrayRemove, deleteField, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const FavouriteBooks = ({ userData, setUserData, allBooks, addFavBookRef }) => {
  const removeFavBook = async (bookID) => {
    const newUserData = userData;
    if (userData.favBooks.length > 1) {
      await updateDoc(doc(db, `users/${userData.uid}`), {
        favBooks: arrayRemove(bookID),
      });

      newUserData.favBooks.filter((favBook) => favBook !== bookID);
      setUserData(newUserData);
    } else {
      await updateDoc(doc(db, `users/${userData.uid}`), {
        favBooks: deleteField(),
      });
      delete newUserData.favBooks;
      setUserData(newUserData);
    }
  };
  return userData.favBooks ? (
    <section className="favourite-books">
      <h2 className="description-headline">Favourite Books</h2>
      {userData.uid === auth.currentUser.uid && (
        <img
          src={addIcon}
          alt=""
          onClick={() => addFavBookRef.current.showModal()}
        />
      )}
      <div className="books">
        {allBooks
          //getting the favourite books from all reads
          .filter((book) => userData.favBooks.includes(book.ID))
          //then iterating through them
          .map((book) => (
            <div className="book-container">
              <Link to={`/${book.ID}`}>
                <BookBasicDetails data={book} />
              </Link>
              {userData.uid === auth.currentUser.uid && (
                <div
                  className="remove-book"
                  onClick={() => removeFavBook(book.ID)}
                >
                  <div className="presentation"></div>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  ) : userData.uid === auth.currentUser.uid ? (
    <div className="add-fav-books">
      <h2> You do not have any favourite books</h2>
      <button onClick={() => addFavBookRef.current.showModal()}>
        Add a Book
      </button>
    </div>
  ) : (
    <h2>This user does not have any favourite books</h2>
  );
};

export default FavouriteBooks;
