import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <img src={comment.avatarURL} alt="" width={30} height={30} />
      <span>{comment.name}</span>
      <p>{comment.comment}</p>
    </div>
  );
};

export default Comment;
