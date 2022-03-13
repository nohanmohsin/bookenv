import React from "react";

const Message = ({ message }) => {
  return (
    <div className="message">
      <img
        src="https://api.adorable.io/avatars/23/abott@adorable.png"
        alt="user pfp"
      />
      <p>{message}</p>
    </div>
  );
};

export default Message;
