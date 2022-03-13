import React, { useState, useEffect } from "react";
import {
  collection,
  orderBy,
  limit,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ threadID }) => {
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const getMessages = async () => {
    const msgResults = [];
    const docsSnapshot = await getDocs(msgQuery);
    docsSnapshot.forEach((doc) => {
      msgResults.push(doc.data());
    });
    setMessages(msgResults);
  };

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <section className="chatbox">
      {messages && messages.map((message) => <Message message={message.msg} />)}

    </section>
  );
};

export default ChatBox;
