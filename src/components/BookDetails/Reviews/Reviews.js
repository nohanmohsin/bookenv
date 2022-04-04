import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import {
  collection,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../../../firebase";
import Review from "./Review";

const Reviews = ({ data, bookID, reviewCount }) => {
  const [formValue, setFormValue] = useState("");
  const [reviews, setReviews] = useState([]);
  //users can only leave reviews if signed in
  const user = auth.currentUser;
  //using collection here cos arrays will be complicated
  const reviewsRef = collection(db, `books/${bookID}/reviews`);
  const submitReview = async (e) => {
    e.preventDefault();
    await addDoc(reviewsRef, {
      review: formValue,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
  };
  useEffect(() => {
    const getReviews = async () => {
      try {
        let resultsArray = [];
        //checking if there is a reviews collection
        //reviews collection is created at first review input
        if (reviewCount > 0) {
          const reviewQuerySnapshot = await getDocs(reviewsRef);
          reviewQuerySnapshot.forEach((doc) => {
            resultsArray.push(doc.data());
          });
        }
        setReviews(resultsArray);
      } catch (err) {
        console.log(err);
      }
    };
    getReviews();
  }, []);
  return (
    <section className="reviews">
      <h2>
        Reviews
        <div className="presentation"></div>
        {data.length}
      </h2>
      {user ? (
        <form onSubmit={submitReview}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />
        </form>
      ) : null}

      {reviews.map((review) => (
        <Review review={review} />
      ))}
    </section>
  );
};

export default Reviews;
