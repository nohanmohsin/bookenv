import React from "react";

const Message = ({ message, createdAt }) => {
  const name = "alu bhau";
  const date = new Date(createdAt * 1000);
  const formattedDate = date.toJSON()
  return (
    <div className="message">
      <img
        src="https://cdn.discordapp.com/avatars/751699113049063496/4f462f58a83d59fd25608a8585c7e9e9.webp?size=48"
        width={48}
        height={48}
        alt="user pfp"
      />
      <div className="text-container">
        <h3>{name}</h3>
        <span>{formattedDate.slice(0, 10)}</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
