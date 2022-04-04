import React from "react";

const Review = ({ review }) => {
  return (
    <div className="review">
      <div className="img-and-name-container">
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
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
