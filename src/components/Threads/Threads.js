import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import ChatBox from "./ChatBox/ChatBox";
import Sidebar from "./Sidebar/Sidebar";

const Threads = () => {
  //last visited thread
  const lastThreadID = JSON.parse(localStorage.getItem("lastVisitedThread"));
  const [threadData, setThreadData] = useState();
  const [joinedThreads, setJoinedThreads] = useState([]);
  let { linkThreadID } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const checkExistence = async () => {
      //checking the link thread id only because last visited thread will always be valid
      const checkThread = await getDoc(doc(db, "threads", linkThreadID));
      if (checkThread.exists()) {
        setThreadData(checkThread.data());
      } else {
        navigate("/not-found");
      }
      return;
    };
    if (linkThreadID) {
      checkExistence();
    } else if (lastThreadID) {
      const lastVisitedThreadData = getDoc(doc(db, "threads", lastThreadID));
      lastVisitedThreadData.then((doc) => setThreadData(doc.data()));
      navigate(`/threads/id=${lastThreadID}`);
    }
  }, []);
  useEffect(() => {
    if (threadData) {
      document.title = `${threadData.name} - Bookenv`;
    }
  }, [threadData]);
  return (
    <main className="thread-page navbar-included">
      <Sidebar
        threadID={linkThreadID ? linkThreadID : lastThreadID}
        joinedThreads={joinedThreads}
        setJoinedThreads={setJoinedThreads}
      />
      {linkThreadID ? (
        <ChatBox
          threadID={linkThreadID}
          threadData={threadData}
          joinedThreads={joinedThreads}
          setJoinedThreads={setJoinedThreads}
        />
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default Threads;
