import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../../firebase";
import {
  collection,
  orderBy,
  limit,
  query,
  serverTimestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ threadID }) => {
  const user = auth.currentUser;
  const dummy = useRef();
  const [messages, setMessages] = useState();
  //used to change the query limit of msgQuery on scroll
  const [msgQueryLimit, setMsgQueryLimit] = useState(50);

  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(
    messagesRef,
    orderBy("createdAt"),
    limit(msgQueryLimit)
  );

  const handleMessagesScroll = (e) => {
    //increasing msg query limit on scroll to the top
    if (e.target.scrollTop === 0) {
      setMsgQueryLimit((prevLimit) => prevLimit + 50);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    await addDoc(messagesRef, {
      name: user.displayName,
      photoURL: user.photoURL,
      msg: e.target[0].value,
      createdAt: serverTimestamp(),
    });
    e.target[0].value = "";
    
  };
  useEffect(() => {
    dummy.current.scrollIntoView({behavior: "smooth"});
  }, [dummy.current]);
  useEffect(() => {
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      if (!querySnapshot.metadata.hasPendingWrites) {
        let dummyArray = [];
        querySnapshot.forEach((doc) => {
          dummyArray.push(doc.data());
        });
        setMessages(dummyArray);
        dummy.current.scrollIntoView();
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <section className="chatbox">
      <div className="messages-container" onScroll={handleMessagesScroll}>
        {messages &&
          messages.map((message) => (
            <Message
              name={message.name}
              message={message.msg}
              createdAt={message.createdAt}
              key={message.id}
            />
          ))}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input placeholder="say something nice" />
      </form>
    </section>
  );
};

export default ChatBox;
