import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import parse from 'html-react-parser'
import Reviews from "./Reviews/Reviews";

const BookDetails = () => {
  const [data, setData] = useState("meow");
  let navigate = useNavigate();
  const exampleData = {
    author: ["Andy Weir"],
    reviewCount: 0,
    publishDate: "2014-02-11",
    genres: "Fiction / Science Fiction / Action & Adventure",
    imageURL: {
      thumbnail:
        "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72sR1qKHjR2KH592fMe3NM7ag0pnPI76kEZ4DOBFqbh9Itwx7UL_mWT4_eVaaJ9CospNg4b-1gcBGf7uWw2LEusT-20JNJ2UeRbDXNOGxica4V2yOZSQlX1LUGXA0ZAJgrtdHPK&source=gbs_api",
      smallThumbnail:
        "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE728RI_J4E7tKM4LoI56LNuDBEP-IpMvTykhqNYpX_HNRmUQK50L9NPw5U6z7ZoQlzsdHcPJkYrtqLkvA2Z08hqMy5aQ7g9QbedsZd-JtV9KYHZB4IkO-PYt-MW93N2L0iKRjX3T&source=gbs_api",
    },
    description:
      "<b>Nominated as one of America's best-loved novels by PBS's <i>The Great American Read</i></b><br><br>Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. <br><br>Now, he's sure he'll be the first person to die there.<br><br>After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he's alive—and even if he could get word out, his supplies would be gone long before a rescue could arrive. <br><br>Chances are, though, he won't have time to starve to death. The damaged machinery, unforgiving environment, or plain-old \"human error\" are much more likely to kill him first. <br><br>But Mark isn't ready to give up yet. Drawing on his ingenuity, his engineering skills—and a relentless, dogged refusal to quit—he steadfastly confronts one seemingly insurmountable obstacle after the next. Will his resourcefulness be enough to overcome the impossible odds against him?",
    pageCount: 400,
    name: "The Martian",

    reviews: [
      {
        name: "Name",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium vulputate nibh massa massa bibendum in enim dui cras. Tempus tellus id ac accumsan laoreet.",
        avatarURL:
          "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      },
      {
        name: "Name",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium vulputate nibh massa massa bibendum in enim dui cras. Tempus tellus id ac accumsan laoreet.",
        avatarURL:
          "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      },
      {
        name: "Name",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium vulputate nibh massa massa bibendum in enim dui cras. Tempus tellus id ac accumsan laoreet.",
        avatarURL:
          "https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo",
      },
    ],
  };
  let { bookID } = useParams();
  //function for getting the book data from firestore db
  const getData = async () => {
    //https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef = doc(db, "books", bookID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setData(docSnap.data());
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
            <h2>OverView</h2>
            <p>{parse(data.description)}</p>
          </section>
          <section className="more-books">
            <h2>More Like This</h2>
          </section>
          <Reviews
            data={exampleData.reviews}
            bookID={bookID}
            reviewAdded={data.reviewAdded}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default BookDetails;
