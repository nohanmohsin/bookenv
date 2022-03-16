import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import { db } from "../../firebase";

const SearchPage = () => {
  const [results, setResults] = useState();
  let { searchQuery } = useParams();
  useEffect(() => {
    const fetchResults = async () => {
      const resultsArray = [];
      const queryDocs = await getDocs(
        query(collection(db, "books"), where("name", "==", searchQuery))
      );
      queryDocs.forEach((doc) => {
        resultsArray.push(doc.data());
      });
      setResults(resultsArray);
    };
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="search-page">
      <h1>Results for "{searchQuery}"</h1>
      
      <div className="book-results">
        <h2>Books</h2>
        <div className="book-results-container">
          {results ? (
            results.map((res) => <BookBasicDetails data={res} />)
          ) : (
            <>loading...</>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
