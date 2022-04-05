import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../../firebase";
import {
  doc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";
import Review from "./Review";

const Reviews = ({ data, bookID, reviewAdded }) => {
  const textAreaRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [reviews, setReviews] = useState([]);
  //users can only leave reviews if signed in
  const user = auth.currentUser;
  //using collection here cos using arrays will be complicated
  const reviewsRef = collection(db, `books/${bookID}/reviews`);
  const submitReview = async (e) => {
    e.preventDefault();
    await addDoc(reviewsRef, {
      userName: user.displayName,
      photoURL: user.photoURL,
      review: formValue,
      createdAt: serverTimestamp()
    })
    .then(() => {
      console.log('hi');
      updateDoc(doc(db, `books/${bookID}`), {
        reviewAdded: true
      })
    })
    setFormValue("");
  };
  useEffect(() => {
    const getReviews = async () => {
      try {
        let resultsArray = [];
        //checking if there is a reviews collection
        //reviews collection is created at first review input
        if (reviewAdded) {
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
    //getReviews();
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
          <textarea
            ref={textAreaRef}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Add a Review"
          />
          <button type="submit">submit</button>
        </form>
      ) : null}

      {reviews.map((review) => (
        <Review review={review} />
      ))}
    </section>
  );
};

export default Reviews;
