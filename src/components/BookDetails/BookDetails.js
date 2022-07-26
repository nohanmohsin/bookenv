import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import parse from "html-react-parser";
import Reviews from "./Reviews/Reviews";
import MoreLikeThis from "./MoreLikeThis";

const BookDetails = () => {
  const [data, setData] = useState("meow");
  const [moreBooks, setMoreBooks] = useState([]);
  let navigate = useNavigate();
  let { bookID } = useParams();
  //function for getting the book data from firestore db
  const getData = async () => {
    //https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef = doc(db, "books", bookID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setData(docSnap.data());
      const moreBooksSnap = await getDocs(
        query(
          collection(db, "books"),
          where("genres", "array-contains-any", docSnap.data().genres),
          limit(3)
        )
      );
      setMoreBooks(moreBooksSnap.docs.map(book => {return {...book.data(), ID: book.id}}))
      console.log(moreBooksSnap.docs);
    } else {
      navigate("/not-found");
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  return (
    <main className="book-details navbar-included">
      {/* checking for name so that we don't get error when no book is found */}
      {data.name ? (
        <>
          <section className="main-details">
            <img src={data.imageURL} alt="book cover" />
            <div className="text-details">
              <h2>{data.name}</h2>
              <span>{data.author[0]}</span>
              <span>
                {data.pageCount} pages • {data.publishDate}
              </span>
              <div className="genres-container">
                {data.genres.map((genre) => (
                  <div className="genre">{genre}</div>
                ))}
              </div>
              <div className="buttons-container">
                <button className="read-now">Read Now</button>
                <span>Write a review</span>
              </div>
            </div>
          </section>
          <section className="overview">
            <h2>Overview</h2>
            <p>{parse(data.description)}</p>
          </section>
          <MoreLikeThis moreBooks={moreBooks}/>
          <Reviews bookID={bookID} reviewAdded={data.reviewAdded} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default BookDetails;
