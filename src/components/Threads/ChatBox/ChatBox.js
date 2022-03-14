import React, { useState, useEffect, useRef } from "react";
import { collection, orderBy, limit, query, getDocs , serverTimestamp, addDoc } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ threadID }) => {
  const dummy = useRef();
  const [formValue, setFormValue] = useState('');

  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(messagesRef, orderBy("createdAt"), limit(50));
  const [messages] = useCollectionData(msgQuery);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(e)
    await addDoc(messagesRef, {
      msg: formValue,
      createdAt: serverTimestamp()
    })
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="chatbox">
      {messages && messages.map((message) => <Message message={message.msg} />)}
      <span ref={dummy}></span>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </section>
  );
};

export default ChatBox;
