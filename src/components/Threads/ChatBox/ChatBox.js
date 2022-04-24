import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../../firebase";
import {
  collection,
  orderBy,
  limit,
  query,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import Message from "./Message";

const ChatBox = ({ threadID }) => {
  const user = auth.currentUser;
  const dummy = useRef();
  const [formValue, setFormValue] = useState("");
  //used to change the query limit of msgQuery on scroll
  const [msgQueryLimit, setMsgQueryLimit] = useState(50);

  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(
    messagesRef,
    orderBy("createdAt"),
    limit(msgQueryLimit)
  );
  const [messages] = useCollectionData(msgQuery);

  const handleMessagesScroll = (e) => {
    //increasing msg query limit on scroll to the top
    if(e.target.scrollTop === 0){
      setMsgQueryLimit((prevLimit) => prevLimit + 50);
      
    }
  }
  const sendMessage = async (e) => {
    e.preventDefault();
    await addDoc(messagesRef, {
      name: user.displayName,
      photoURL: user.photoURL,
      msg: formValue,
      createdAt: serverTimestamp()
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    dummy.current.scrollIntoView();
  }, [])
  return (
    <section className="chatbox">
      <div className="messages-container" onScroll={handleMessagesScroll}>
        {messages && messages.map((message) => <Message message={message.msg} createdAt={message.createdAt.seconds} key={message.id}/>)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          autofocus
        />
      </form>
    </section>
  );
};

export default ChatBox;
