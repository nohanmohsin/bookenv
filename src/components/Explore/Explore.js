import React from "react";
import { exampleData } from "./exampleData";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const Explore = () => {
  return (
    <main className="explore navbar-included">
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
