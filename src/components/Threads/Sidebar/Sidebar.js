import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
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
            <Link to={`/threads/id=${thread.id}`}>
              <div className="thread">
                <h3>{thread.name}</h3>
              </div>
            </Link>
          ))
        ) : (
          <h3>No Threads Joined...Join a thread now</h3>
        )}
      </div>
      <form onSubmit={makeThread}>
        <input
          type="text"
          placeholder="Enter the name of the Thread"
          required
        />
        <button className="make-thread" type="submit">
          Make New Thread
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;
