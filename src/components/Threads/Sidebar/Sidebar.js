import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";

const Sidebar = () => {
  let navigate = useNavigate();
  const makeThread = async (e) => {
    e.preventDefault()
    const threadRef = await addDoc(collection(db, "threads"), {
      name: e.target[0].value,
      createdAt: serverTimestamp()
    })
    navigate(`/threads/id=${threadRef.id}`)
    //very hacky solution
    window.location.reload()
  }
  return (
    <aside className="threads-sidebar">
      <form onSubmit={makeThread}>
        <input type="text" placeholder="Enter the name of the Thread" required/>
      <button className="make-thread" type="submit">Make New Thread</button>
      </form>      
    </aside>
  );
};

export default Sidebar;
