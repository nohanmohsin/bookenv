import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import ChatBox from "./ChatBox/ChatBox";
import Sidebar from "./Sidebar/Sidebar";

const Threads = () => {
  //last visited thread
  const lastThreadID = JSON.parse(localStorage.getItem('lastVisitedThread'))
  let { linkThreadID } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const checkExistence = async () => {
      //checking the link thread id only because last visited thread will always be valid
      const checkThread = await getDoc(doc(db, "threads", linkThreadID));
      if (checkThread.exists()) {
        return;
      } else {
        navigate("/not-found")
      }
    };
    if(linkThreadID){
      checkExistence()
    } else {

      navigate(`/threads/id=${lastThreadID}`)
    }
  }, []);
  return (
    <main className="thread-page navbar-included">
      <Sidebar threadID={linkThreadID ? linkThreadID : lastThreadID}/>
      {linkThreadID ? <ChatBox threadID={linkThreadID} /> : <p>Loading...</p>}
    </main>
  );
};

export default Threads;
