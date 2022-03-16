import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  orderBy,
  limit,
  query,
  getDocs,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ threadID }) => {
  const dummy = useRef();
  const [formValue, setFormValue] = useState("");
  //used to change the query limit of msgQuery on scroll(will implement some day :/)
  const [msgQueryLimit, setMsgQueryLimit] = useState(50);

  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(
    messagesRef,
    orderBy("createdAt"),
    limit(msgQueryLimit)
  );
  const [messages] = useCollectionData(msgQuery);

  const sendMessage = async (e) => {
    e.preventDefault();
    await addDoc(messagesRef, {
      msg: formValue,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="chatbox">
      <div className="messages-container">
        {messages && messages.map((message) => <Message message={message} />)}
      </div>

      <span ref={dummy}></span>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />
      </form>
    </section>
  );
};

export default ChatBox;
