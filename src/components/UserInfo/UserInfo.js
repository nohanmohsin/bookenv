import {
  arrayUnion,
  collection,
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
          <section className="recent-reads">
            <h2>Recent Reads</h2>
            {allBooks.slice(-3).map((book) => (
              <Link to={`/${book.ID}`}>
                <BookBasicDetails data={book} />
              </Link>
            ))}
          </section>
          {userData.reviews ? (
            <section className="recent-reviews">
              <h2>Recent Reviews</h2>
              {
                <Review
                  review={userData.reviews[userData.reviews.length - 1]}
                />
              }
            </section>
          ) : (
            <></>
          )}
          {userData.favBooks ? (
            <section className="favourite-books">
              <h2>Favourite Books</h2>
              {userData.uid === user.uid ? (
                <img
                  src={addIcon}
                  alt=""
                  onClick={() => addFavBookRef.current.showModal()}
                />
              ) : (
                <></>
              )}
              {allBooks
                //getting the favourite books from all reads
                .filter((book) => userData.favBooks.includes(book.ID))
                //then iterating through them
                .map((book) => (
                  <Link to={`/${book.ID}`}>
                    <BookBasicDetails data={book} />
                  </Link>
                ))}
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