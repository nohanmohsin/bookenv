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
  arrayRemove,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ReactComponent as ThreadLeaveIcon } from "../../../icons/leave-thread-icon.svg";
import { db } from "../../../firebase";
import Message from "./Message";
import NoMessages from "./NoMessages";
import { useNavigate } from "react-router-dom";

const ChatBox = ({ threadID, threadData, joinedThreads, setJoinedThreads }) => {
  const user = auth.currentUser;
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  //used to change the query limit of msgQuery on scroll
  const [msgQueryLimit, setMsgQueryLimit] = useState(50);
  let navigate = useNavigate();
  const messagesRef = collection(db, `threads/${threadID}/messages`);
  const msgQuery = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    limit(msgQueryLimit)
  );

  const leaveThread = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      threads: arrayRemove({ id: threadID, name: threadData.name }),
    });
    if (joinedThreads.length > 1) {
      const nextThreadID =
        joinedThreads[
          joinedThreads.findIndex((thread) => thread.id === threadID) - 1
        ].id;

      setJoinedThreads((prevThreads) => {
        return prevThreads.filter((thread) => thread.id !== threadID);
      });
      navigate(`/threads/id=${nextThreadID}`);
      //very hacky solution
      window.location.reload();
    } else {
      navigate("/threads");
      window.location.reload()
    }
  };
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
      uid: user.uid,
      photoURL: user.photoURL,
      msg: e.target[0].value,
      createdAt: serverTimestamp(),
    });
    e.target[0].value = "";
  };
  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView();
    }
  }, [dummy]);
  useEffect(() => {
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      //using serverTimestamp() will result in 2 writes to the db
      if (!querySnapshot.metadata.hasPendingWrites) {
        let dummyArray = [];
        querySnapshot.forEach((doc) => {
          dummyArray.push(doc.data());
        });
        setMessages(dummyArray.reverse());
        dummy.current.scrollIntoView();
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <section className="chatbox">
      <header>
        <h2>{threadData && threadData.name}</h2>{" "}
        <ThreadLeaveIcon onClick={leaveThread} />
      </header>
      {messages.length > 0 ? (
        <div className="messages-container" onScroll={handleMessagesScroll}>
          {messages.map((message) => (
            <Message
              name={message.name}
              uid={message.uid}
              photoURL={message.photoURL}
              message={message.msg}
              createdAt={message.createdAt}
              key={message.id}
            />
          ))}
          <div ref={dummy}></div>
        </div>
      ) : (
        <NoMessages />
      )}
      <form onSubmit={sendMessage}>
        <input placeholder="say something nice" />
      </form>
    </section>
  );
};

export default ChatBox;
