import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import ChatBox from "./ChatBox/ChatBox";
import Sidebar from "./Sidebar/Sidebar";

const Threads = () => {
  let { threadID } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    const checkExistence = async () => {
      const checkThread = await getDoc(doc(db, "threads", threadID));
      if (checkThread.exists()) {
        return;
      } else {
        navigate("/not-found")
      }
    };
    checkExistence()
    
  }, []);
  return (
    <main className="thread-page navbar-included">
      <Sidebar />
      {threadID ? <ChatBox threadID={threadID} /> : <p>idk</p>}
    </main>
  );
};

export default Threads;
