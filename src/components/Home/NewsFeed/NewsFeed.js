import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import RecSection from "./RecSection";

const NewsFeed = () => {
  const [recBooks, setRecBooks] = useState([]);
  const [otherBooks, setOtherBooks] = useState();
  function mode(arr) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();
  }
  useEffect(() => {
    const getRecommendationData = async () => {
      let resultsArray = [];
      let recResultsArray = [];
      let genres = [];
      const userBooksDBRef = collection(
        db,
        `users/${auth.currentUser.uid}/books`
      );
      const userBookDocs = await getDocs(userBooksDBRef);
      userBookDocs.forEach((book) => resultsArray.push(book.data()));
      //setting data for uncompleted books
      setOtherBooks({
        ...otherBooks,
        continueReading: resultsArray.filter((res) => res.completed === false),
      });
      resultsArray.forEach((result) => genres.push(...result.genres));
      const favGenre = mode(genres);
      const recBooksDocs = await getDocs(
        query(
          collection(db, "books"),
          where("genres", "array-contains", favGenre)
        )
      );
      recBooksDocs.forEach(
        (book) =>
          //if user hasn't already read the book it will be recommended
          !resultsArray.some((resBook) => resBook.ID === book.id) &&
          recResultsArray.push({ ...book.data(), ID: book.id })
      );
      sessionStorage.setItem("recBooks", JSON.stringify(recResultsArray));
      setRecBooks(recResultsArray);
      const newUploadsDocs = await getDocs(
        query(collection(db, "books"), orderBy("uploadTime"), limit(10))
      );
      setOtherBooks((prevOtherBooks) => {
        const newOtherBooks = {
          ...prevOtherBooks,
          newUploads: newUploadsDocs.docs.map((book) => ({
            ...book.data(),
            ID: book.id,
          })),
        };
        return newOtherBooks;
      });
    };
    if (JSON.parse(sessionStorage.getItem("otherBooks"))) {
      setOtherBooks(JSON.parse(sessionStorage.getItem("otherBooks")));
      setRecBooks(JSON.parse(sessionStorage.getItem("recBooks")));
    } else {
      getRecommendationData();
    }
  }, []);
  return (
    <main className="home navbar-included">
      <section className="user-info">
        <img src={auth.currentUser.photoURL} alt="" />
        <h2>{auth.currentUser.displayName}</h2>
        <Link to={`/userID=${auth.currentUser.uid}`}>
          <button>Update Profile</button>
        </Link>
      </section>
      {recBooks.length > 0 && (
        <section className="rec-books">
          {
            <RecSection
              booksDataArr={recBooks.length > 0 && recBooks}
              title={"Recommended Books"}
            />
          }
        </section>
      )}
      <section className="continue-reading">
        <RecSection
          booksDataArr={otherBooks && otherBooks.continueReading}
          title={"Continue Reading"}
        />
      </section>
      <section className="new-uploads">
        <RecSection
          booksDataArr={otherBooks && otherBooks.newUploads}
          title={"New Uploads"}
        />
      </section>
    </main>
  );
};

export default NewsFeed;
