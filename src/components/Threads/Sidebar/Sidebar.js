import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../../firebase";

const Sidebar = ({ threadID }) => {
  const [joinedThreads, setJoinedThreads] = useState([]);
  //these refs are used for dialogs
  const makeThreadRef = useRef();
  const joinThreadRef = useRef();
  let navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    const getJoinedThreads = async () => {
      const joinedThreadsRef = await getDoc(doc(db, "users", user.uid));
      const threadsDummy = joinedThreadsRef.data().threads;
      setJoinedThreads(threadsDummy);
      //checking if the threadID provided in the link is in joined threads
      const checkExistence = threadsDummy.some(
        (thread) => thread.id === threadID
      );
      //if not, adding it to joined threads
      if (!checkExistence) {
        const threadRef = await getDoc(doc(db, "threads", threadID));
        setJoinedThreads((prevThreads) => [
          ...prevThreads,
          { name: threadRef.data().name, id: threadRef.id },
        ]);
        await updateDoc(doc(db, "users", user.uid), {
          threads: arrayUnion({
            name: threadRef.data().name,
            id: threadRef.id,
          }),
        });
      }

      //to prevent adding the active class multiple times
      if (!document.getElementById(threadID).classList.contains("active")) {
        //setting the active class to the currently active thread div in sidebar
        document.getElementById(threadID).className += " active";
      }
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
      //storing newly joined thread without reloading
      setJoinedThreads((prevThreads) => [
        ...prevThreads,
        { name: checkThread.data().name, id: checkThread.id },
      ]);
    } else {
      alert("invalid link or ID");
    }
    joinThreadRef.current.close();
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
    makeThreadRef.current.close();
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
              id={thread.id}
              onClick={() => {
                navigate(`/threads/id=${thread.id}`);
                localStorage.setItem(
                  "lastVisitedThread",
                  JSON.stringify(thread.id)
                );
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
      <dialog className="make-thread-dialog" ref={makeThreadRef}>
        <form onSubmit={makeThread} className="make-thread" method="dialog">
          <input
            type="text"
            placeholder="Enter the name of the Thread"
            required
          />
          <button className="make-thread" type="submit">
            Make New Thread
          </button>
        </form>
      </dialog>

      <dialog className="join-thread-dialog" ref={joinThreadRef}>
        <form className="join-thread" onSubmit={joinThread} method="dialog">
          <input
            type="text"
            placeholder="Enter the link or the ID of the thread"
            minLength={20}
            required
          />
          <button type="submit">Join Thread</button>
        </form>
      </dialog>
      <div className="open-dialogs">
        <button
          className="open-make-thread"
          onClick={() => makeThreadRef.current.showModal()}
        >
          Make New Thread
        </button>
        <button
          className="open-join-thread"
          onClick={() => joinThreadRef.current.showModal()}
        >
          Join a Thread
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;