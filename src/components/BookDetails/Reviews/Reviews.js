import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../../firebase";
import {
  doc,
  collection,
  serverTimestamp,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
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
      name: user.displayName,
      avatarURL: user.photoURL,
      review: formValue,
      createdAt: serverTimestamp(),
    }).then(() => {
      updateDoc(doc(db, `books/${bookID}`), {
        reviewAdded: true,
      });
    });
    await updateDoc(doc(db, `users/${user.uid}`), {
      reviews: arrayUnion({
        bookID: bookID,
        comment: formValue
      })
    })
    setFormValue("");
  };
  //used for textarea dynamic height change
  function OnInput() {
    console.log(this.style)
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
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
        alert("Couldn't get the reviews at this moment");
      }
    };
    if (user) {
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
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
          <textarea
            ref={textAreaRef}
            value={formValue}
            onChange={(e) => {
              setFormValue(e.target.value);
              OnInput();
            }}
            placeholder="Add a Review"
            maxLength={1000}
          />
          <button type="submit">Submit</button>
        </form>
      ) : null}

      {reviews.map((review) => (
        <Review review={review} />
      ))}
    </section>
  );
};

export default Reviews;
