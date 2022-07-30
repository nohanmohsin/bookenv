import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import Comment from "./Comment";
import { auth, db } from "../../../firebase";

const PageComments = ({ pageNum, data, bookID }) => {
  const [commentContent, setCommentContent] = useState("");
  const user = auth.currentUser;
  const submitComment = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, `books/${bookID}/pagecomments`), {
      name: user.displayName,
      avatarURL:
        user.photoURL,
      comment: commentContent,
      pageNum: pageNum,
      createdAt: serverTimestamp(),
    });
    
    setCommentContent("");
    alert("Comment Added!")
  };
  const filteredData = data.filter((comment) => comment.pageNum === pageNum);
  return (
    <section className="page-comments">
      <h3>Comments</h3>
      <form onSubmit={submitComment}>
        <img
          src={user.photoURL}
          alt=""
          width={30}
          height={30}
        />
        <input
          type="text"
          placeholder="Comment on this Page"
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
        />
      </form>
      <div className="comments">
        {filteredData.length > 0 ? (
          filteredData.map((comment) => (
            <Comment comment={comment}/>
          ))
        ) : (
          <p>Be the first to comment on this page</p>
        )}
      </div>
    </section>
  );
};

export default PageComments;
