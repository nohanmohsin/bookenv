import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import { db } from "../../firebase";

const SearchPage = () => {
  const [bookResults, setBookResults] = useState();
  const [userResults, setUserResults] = useState();
  let { searchQuery } = useParams();
  useEffect(() => {
    const fetchUserResults = async () => {
      let resultsArray = [];
      const userDocs = await getDocs(
        query(
          collection(db, "users"),
          orderBy("userName"),
          startAt(searchQuery),
          endAt(searchQuery + "\uf8ff")
        )
      );
      
      userDocs.forEach((userDoc) => {
        resultsArray.push(userDoc.data());
      });
      setUserResults(resultsArray);
    };
    const fetchBookResults = async () => {
      let resultsArray = [];
      const queryDocs = await getDocs(
        query(
          collection(db, "books"),
          where("nameIndices", "array-contains-any", searchQuery.split(" ", 10))
        )
      );
      queryDocs.forEach((doc) => {
        resultsArray.push({ ...doc.data(), id: doc.id });
      });
      setBookResults(resultsArray);
    };
    fetchUserResults();
    fetchBookResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="search-page navbar-included">
      <h1>Results for "{searchQuery}"</h1>
      {bookResults && userResults ? (
        <>
          <section className="book-results">
            <h2>Books</h2>
            <div className="results-container">
              {bookResults.length > 0 ? (
                bookResults.map((res) => (
                  <Link to={`/${res.id}`}>
                    <BookBasicDetails data={res} />
                  </Link>
                ))
              ) : (
                <p>No such book Exists</p>
              )}
            </div>
          </section>
          <section className="user-results">
            <h2>Users</h2>
            <div className="results-container">
              {userResults.length > 0 ? (
                userResults.map((res) => (
                  <Link to={`/userID=${res.uid}`}>
                    <div className="user-res">
                      <img src={res.avatarURL} alt="" /> <h3>{res.userName}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No such User Exists</p>
              )}
            </div>
          </section>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </main>
  );
};

export default SearchPage;
