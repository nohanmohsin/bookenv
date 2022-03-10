import React from "react";
import { exampleData } from "./exampleData";
import { authorData } from "./authorData";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import AuthorBasicDetails from "../AuthorBasicDetails/AuthorBasicDetails";

const Explore = () => {
  return (
    <main className="explore">
      <section className="most-read-books">
        <h1>Explore our most read books</h1>
        <span>Our favourite books of the month</span>
        <div className="books-details-container">
          {exampleData.map((data) => (
            <BookBasicDetails data={data} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Explore;
