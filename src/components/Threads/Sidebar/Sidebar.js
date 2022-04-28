import React from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";

const Sidebar = () => {
  let navigate = useNavigate();
  const joinedThreads = [
    {
      name: "zafar iqbal",
      id: "w22q8Ny4sMxSwzx2ZyuW",
    },
    {
      name: "zafar iqbal",
      id: "w22q8Ny4sMxSwzx2ZyuW",
    },
    {
      name: "zafar iqbal",
      id: "w22q8Ny4sMxSwzx2ZyuW",
    },
  ];
  const makeThread = async (e) => {
    e.preventDefault();
    const threadRef = await addDoc(collection(db, "threads"), {
      name: e.target[0].value,
      createdAt: serverTimestamp(),
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
