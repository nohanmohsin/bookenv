import React, { useState, useEffect } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";

const Sidebar = () => {
  const [joinedThreads, setJoinedThreads] = useState([]);
  let navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    const getJoinedThreads = async () => {
      const joinedThreadsRef = await getDoc(doc(db, "users", user.uid));
      console.log(joinedThreadsRef.data().threads);
      setJoinedThreads(joinedThreadsRef.data().threads);
    };
    getJoinedThreads();
  }, []);

  const joinThread = async (e) => {
    e.preventDefault();
    let threadID = e.target[0].value;
    if (e.target[0].value.startsWith("http://localhost:3000/threads/id=")) {
      threadID = e.target[0].value.substr(
        e.target[0].value.indexOf("id=") + 3,
        20
      );
    }
    const checkThread = await getDoc(doc(db, "threads", threadID));

    if (checkThread.exists()) {
      const userThreadRef = await updateDoc(doc(db, "users", user.uid), {
        threads: arrayUnion({
          name: checkThread.data().name,
          id: checkThread.id,
        }),
      });
      e.target[0].value = "";
      
    } else {
      alert("invalid link or ID");
    }
  };

  const makeThread = async (e) => {
    e.preventDefault();

    const threadRef = await addDoc(collection(db, "threads"), {
      name: e.target[0].value,
      createdAt: serverTimestamp(),
    });

    const userThreadRef = updateDoc(doc(db, "users", user.uid), {
      threads: arrayUnion({
        name: e.target[0].value,
        id: threadRef.id,
      }),
    });

    navigate(`/threads/id=${threadRef.id}`);
    //very hacky solution
    window.location.reload();
  };

  return (
    <aside className="threads-sidebar">
      <h2>Joined Threads</h2>
      <div className="joined-threads">
        {joinedThreads.length > 0 ? (
          joinedThreads.map((thread) => (
            //Link wouldn't work in this scenario
            <div
              className="thread"
              onClick={() => {
                navigate(`/threads/id=${thread.id}`);
                window.location.reload();
              }}
            >
              <h3>{thread.name}</h3>
            </div>
          ))
        ) : (
          <h3>No Threads Joined...Join a thread now</h3>
        )}
      </div>
      <form onSubmit={makeThread} className="make-thread">
        <input
          type="text"
          placeholder="Enter the name of the Thread"
          minLength={20}
          required
        />
        <button className="make-thread" type="submit">
          Make New Thread
        </button>
      </form>
      <form className="join-thread" onSubmit={joinThread}>
        <input
          type="text"
          placeholder="Enter Link or the ID of the Thread"
          minLength={20}
          required
        />
        <button type="submit">Join Thread</button>
      </form>
    </aside>
  );
};

export default Sidebar;
