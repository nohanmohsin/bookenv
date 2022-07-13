import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import Review from "../BookDetails/Reviews/Review";
import addIcon from "../../icons/add-icon.svg";
import AddFavBookDialog from "./AddFavBookDialog/AddFavBookDialog";

const UserInfo = () => {
  const [userData, setUserData] = useState();
  const [allBooks, setAllBooks] = useState([]);
  let { uid } = useParams();
  const user = auth.currentUser;
  const addFavBookRef = useRef();
  const removeFavBook = async (bookID) => {
    const newUserData = userData;
    if (userData.favBooks.length > 1) {
      await updateDoc(doc(db, `users/${uid}`), {
        favBooks: arrayRemove(bookID),
      });

      newUserData.favBooks.filter((favBook) => favBook !== bookID);
      setUserData(newUserData);
    } else {
      await updateDoc(doc(db, `users/${uid}`), {
        favBooks: deleteField(),
      });
      delete newUserData.favBooks;
      setUserData(newUserData);
    }
  };
  useEffect(() => {
    const getUserData = async () => {
      const userSnap = await getDoc(doc(db, `users/${uid}`));
      if (userSnap.exists()) {
        const recentBooksQuery = query(
          collection(db, `users/${uid}/books`),
          orderBy("timeStamp")
        );
        const allBooksSnap = await getDocs(recentBooksQuery);

        if (allBooksSnap) {
          let allBooksDummy = [];
          allBooksSnap.forEach((book) => {
            allBooksDummy.push(book.data());
          });
          setAllBooks(allBooksDummy);
        }
        setUserData(userSnap.data());
      } else {
        alert("Wrong link or user ID");
      }
    };
    getUserData();
  }, []);
  return userData ? (
    <main className="user-info navbar-included">
      <section className="username-and-avatar">
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
          width={300}
          alt=""
        />
        <h1>{userData.userName}</h1>
      </section>

      {allBooks.length > 0 ? (
        <>
          <div className="recent-reads-and-reviews-container">
            <section className="recent-reads">
              <h2 className="description-headline">Recent Reads</h2>
              <div className="books">
                {allBooks.slice(-3).map((book) => (
                  <Link to={`/${book.ID}`}>
                    <BookBasicDetails data={book} />
                  </Link>
                ))}
              </div>
            </section>
            {userData.reviews ? (
              <section className="recent-reviews">
                <h2 className="description-headline">Recent Reviews</h2>
                {
                  <Review
                    review={userData.reviews[userData.reviews.length - 1]}
                  />
                }
              </section>
            ) : (
              <></>
            )}
          </div>
          {userData.favBooks ? (
            <section className="favourite-books">
              <h2 className="description-headline">Favourite Books</h2>
              {userData.uid === user.uid && (
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
          )}
        </>
      ) : (
        <h1 className="no-books">This user has not read any books</h1>
      )}

      <AddFavBookDialog
        addFavBookRef={addFavBookRef}
        userData={userData}
        allBooks={allBooks}
      />
    </main>
  ) : (
    <p>Loading...</p>
  );
};

export default UserInfo;
