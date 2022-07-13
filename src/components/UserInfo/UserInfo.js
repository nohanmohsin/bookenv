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
import AddFavBookDialog from "./AddFavBookDialog/AddFavBookDialog";
import FavouriteBooks from "./FavouriteBooks";

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
          <FavouriteBooks
            userData={userData}
            setUserData={setUserData}
            allBooks={allBooks}
            addFavBookRef={addFavBookRef}
          />
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
