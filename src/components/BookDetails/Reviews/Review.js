import React from "react";

const Review = ({ review }) => {
  console.log(review)
  return (
    <div className="review">
      <div className="img-and-name-container">
        <img
          src={review.avatarURL}
          alt=""
          width={48}
          height={48}
        />
        <span>{review.name}</span>
      </div>
      <p>{review.review}</p>
    </div>
  );
};

export default Review;
