import React from "react";
import { exampleData } from "./exampleData";
import { authorData } from "./authorData";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";
import AuthorBasicDetails from "../AuthorBasicDetails";

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
      <section className="most-popular-authors">
        <h1>Check out our most popular authors</h1>
        <span>Our favourite authors of the month</span>
        <div className="authors-details-container">
          {authorData.map((data) => (
            <AuthorBasicDetails data={data} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Explore;
