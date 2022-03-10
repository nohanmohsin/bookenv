import React from "react";

const AuthorBasicDetails = ({ data }) => {
  return <div className="author-basic-details">
      <img src={data.imageURL} alt="author" />
      <span>{data.name}</span>
  </div>;
};

export default AuthorBasicDetails;
