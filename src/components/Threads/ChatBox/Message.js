import React from "react";
import { Link } from "react-router-dom";

const Message = ({ name, uid, photoURL, message, createdAt }) => {
  const date = new Date(createdAt.seconds * 1000);
  const formattedDate = date.toJSON().slice(0, 10);
  return (
    <div className="message">
      <Link to={`/userID=${uid}`}>
        <img
          src={photoURL}
          width={48}
          height={48}
          alt="user pfp"
        />
      </Link>
      <div className="text-container">
        <Link to={`/userID=${uid}`}>
          <h3>{name}</h3>
        </Link>
        <span>{formattedDate}</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
