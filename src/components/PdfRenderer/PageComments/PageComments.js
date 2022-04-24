import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../../firebase";

const PageComments = ({ pageNum, data, bookID }) => {
  const [commentContent, setCommentContent] = useState("");
  const user = auth.currentUser;
  const submitComment = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, `books/${bookID}/pagecomments`), {
      name: user.displayName,
      avatarURL:
        "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      comment: commentContent,
      pageNum: pageNum,
      createdAt: serverTimestamp(),
    });
    setCommentContent("");
  };
  const filteredData = data.filter((comment) => comment.pageNum === pageNum);
  return (
    <section className="page-comments">
      <h3>Comments</h3>
      <form onSubmit={submitComment}>
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
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
            <div className="comment">
              <img src={comment.avatarURL} alt="" width={30} height={30} />
              <span>{comment.name}</span>
              <p>{comment.comment}</p>
            </div>
          ))
        ) : (
          <p>Be the first to comment on this page</p>
        )}
      </div>
    </section>
  );
};

export default PageComments;
