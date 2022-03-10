import React from "react";
import { useParams } from "react-router-dom";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import { exampleData } from "../Explore/exampleData";

const SearchPage = () => {
  let { query } = useParams();

  return (
    <main className="search-page">
      <h1>Results for "{query}"</h1>
      <div className="book-results">
        <h2>Books</h2>
        <div className="book-results-container">
          {exampleData.map((data) => (
            <BookBasicDetails data={data} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
