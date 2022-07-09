import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const UserInfo = () => {
  const [userData, setUserData] = useState();
  const [recentReads, setRecentReads] = useState();
  let { uid } = useParams();
  useEffect(() => {
    const getUserData = async () => {
      const userSnap = await getDoc(doc(db, `users/${uid}`));
      if (userSnap.exists()) {
        const recentBooksQuery = query(
          collection(db, `users/${uid}/books`),
          orderBy("timeStamp"),
          limit(3)
        );
        const recentBooksSnap = await getDocs(recentBooksQuery);

        if (recentBooksSnap) {
          let recentBooksDummy = [];
          recentBooksSnap.forEach((book) => {
            recentBooksDummy.push(book.data());
          });
          setRecentReads(recentBooksDummy);
        }
        setUserData(userSnap.data());
      } else {
        alert("Wrong link or user ID");
      }
    };
    getUserData();
  }, []);
  return userData ? (
    <main className="user-info navbar-included">
      <section className="username-and-avatar">
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
          alt=""
        />
        <h1>{userData.userName}</h1>
      </section>
      {recentReads.length > 0 ? (
        <>
          <section className="recent-reads">
            <h2>Recent Reads</h2>
            {
              recentReads.map((book) => <Link to={`/${book.ID}`}><BookBasicDetails data={book}/></Link>)
            }
          </section>
          <section className="recent-comments">

          </section>
        </>
      ) : (
        <></>
      )}
    </main>
  ) : (
    <p>Loading...</p>
  );
};

export default UserInfo;
