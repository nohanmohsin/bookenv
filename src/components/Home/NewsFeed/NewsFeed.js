import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { Link } from "react-router-dom";
import BookBasicDetails from "../../BookBasicDetails/BookBasicDetails";

const NewsFeed = () => {
  const [recBooks, setRecBooks] = useState();

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
      resultsArray.forEach((result) => genres.push(...result.genres));
      
      const favGenre = mode(genres);
      const recBooksDocs = await getDocs(query(collection(db, "books"), where("genres", "array-contains", favGenre)));
      recBooksDocs.forEach(book => !resultsArray.some(resBook => resBook.ID === book.id) && recResultsArray.push({...book.data(), ID: book.id}))
      setRecBooks(recResultsArray);
    };
    getRecommendationData();
  }, []);
  return (
    <main className="home navbar-included">
      <section className="user-info">
        <img src={auth.currentUser.photoURL} alt="" />
        <h2>{auth.currentUser.displayName}</h2>
        <button>Update Profile</button>
      </section>
      <section className="rec-books">
        <h2>Recommended Books</h2>
        <div className="books">
          {recBooks && recBooks.map(book => <Link to={`/${book.ID}`}>
            <BookBasicDetails data={book} />
          </Link>)
            
          }
          
        </div>
      </section>
    </main>
  );
};

export default NewsFeed;
