import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";

import { auth, db } from "../../firebase";

import Shelf from "./Shelf";

const MyLibrary = () => {
  const user = auth.currentUser;
  //used for showing how many books there are in your library
  const [bookCount, setBookCount] = useState(0);
  const [libData, setLibData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  //used for adding books
  const [shelfID, setShelfID] = useState();
  //used for getting currently active book data
  const [bookData, setBookData] = useState();
  const addBookRef = useRef();
  const makeShelfRef = useRef();
  const confirmRemovalRef = useRef();
  const addBook = async (e) => {
    e.preventDefault();
    let bookID = e.target[0].value;
    if (e.target[0].value.startsWith("http://localhost:3000/")) {
      bookID = e.target[0].value.slice(-20);
    }
    const bookSnap = await getDoc(doc(db, "books", bookID));
    //TODO: check for duplicates in books array
    //duplicates wouldn't be in database but they will display in the website without reload
    if (bookSnap.exists()) {
      await updateDoc(doc(db, `users/${user.uid}/libData/${shelfID}`), {
        books: arrayUnion({
          imageURL: bookSnap.data().imageURL,
          name: bookSnap.data().name,
          id: bookSnap.id,
        }),
      });
      const newShelves = [...libData];

      newShelves
        //finding the index of that shelf
        .find((shelf) => shelf.shelfID === shelfID)
        //adding the book to that shelf
        .books.push({
          imageURL: bookSnap.data().imageURL,
          name: bookSnap.data().name,
          id: bookSnap.id,
        });
      setLibData(newShelves);
    } else {
      alert("wrong id of book");
    }
    addBookRef.current.close();
  };
  const removeBook = async () => {
    const newShelves = [...libData];
    const activeShelf = newShelves.find((shelf) => shelf.shelfID === shelfID);

    if (activeShelf.books.length > 1) {
      const newBooks = activeShelf.books.filter(
        (book) => book.id !== bookData.id
      );
      //doing this before db update to prevent button spamming
      newShelves.find((shelf) => shelf.shelfID === shelfID).books = newBooks;
      setLibData(newShelves);
      confirmRemovalRef.current.close();
      await updateDoc(doc(db, `users/${user.uid}/libData/${shelfID}`), {
        books: arrayRemove({
          imageURL: bookData.imageURL,
          name: bookData.name,
          id: bookData.id,
        }),
      });
    } else {
      const updatedShelves = newShelves.filter(
        (shelf) => shelf.shelfID !== shelfID
      );
      setLibData(updatedShelves);
      confirmRemovalRef.current.close();
      await deleteDoc(doc(db, `users/${user.uid}/libData`, shelfID));
    }
  };
  const makeShelf = async (e) => {
    e.preventDefault();
    //TODO: check for links of books entered in the second input
    let bookID = e.target[1].value;
    if (e.target[1].value.startsWith("http://localhost:3000/")) {
      bookID = e.target[1].value.slice(-20);
    }
    const bookCheckSnap = await getDoc(doc(db, "books", bookID));
    e.target[1].value = "";
    if (bookCheckSnap.exists()) {
      //using this because I need the id of the shelf for adding books
      const shelfDocRef = doc(collection(db, `users/${user.uid}/libData`));
      await setDoc(shelfDocRef, {
        shelfName: e.target[0].value,
        shelfID: shelfDocRef.id,
        books: arrayUnion({
          imageURL: bookCheckSnap.data().imageURL,
          name: bookCheckSnap.data().name,
          id: bookCheckSnap.id,
        }),
      });
      setLibData((prevShelves) => [
        {
          shelfName: e.target[0].value,
          shelfID: shelfDocRef.id,
          books: [
            {
              imageURL: bookCheckSnap.data().imageURL,
              name: bookCheckSnap.data().name,
              id: bookCheckSnap.id,
            },
          ],
        },
        ...prevShelves,
      ]);
    } else {
      alert("Wrong ID of book");
    }
    makeShelfRef.current.close();
  };
  useEffect(() => {
    const getlibData = async () => {
      const libDataSnap = await getDocs(
        collection(db, `users/${user.uid}/libData`)
      );
      let libDataDummy = [];
      if (libDataSnap.docs.length > 0) {
        libDataSnap.forEach((shelf) => {
          libDataDummy.push(shelf.data());
        });
        setLibData(libDataDummy.reverse());
      }
      setDisabled(false);
      return;
    };
    getlibData();
  }, []);
  useEffect(() => {
    let dummyCount = 0;
    console.log(libData);
    if (libData.length > 0) {
      libData.map((shelf) => (dummyCount += shelf.books.length));
    }
    setBookCount(dummyCount);
  }, [libData]);
  useEffect(() => {
    if (bookData) {
      confirmRemovalRef.current.showModal();
    }
  }, [bookData]);
  return (
    <main className="my-library navbar-included">
      {/* mapping through the db data */}

      {libData.length > 0 ? (
        <>
          <div className="title">
            <div>
              <h1>Your Library</h1>
              <p>
                You have {libData.length}{" "}
                {libData.length > 1 ? "shelves" : "shelf"} and {bookCount}{" "}
                {bookCount > 1 ? "books" : "book"} in here
              </p>
            </div>
            <button
              className="make-shelf"
              onClick={() => makeShelfRef.current.showModal()}
            >
              Make a Shelf
            </button>
          </div>

          {libData.map((shelf) => (
            <Shelf shelf={shelf} setShelfID={setShelfID} setBookData={setBookData} addBookRef={addBookRef}/>
          ))}
        </>
      ) : (
        <div className="no-shelves">
          <h1>This Library is empty</h1>
          <p>
            Fill this library with many books!!! Make your first shelf and add
            books to it
          </p>
          <button
            disabled={disabled}
            onClick={() => makeShelfRef.current.showModal()}
          >
            Make a Shelf
          </button>
        </div>
      )}
      <dialog className="confirm-removal" ref={confirmRemovalRef}>
        <div className="info-container">
          <h2>Are you sure you want to remove this book?</h2>
          <button onClick={removeBook}>Confirm</button>
        </div>
      </dialog>
      <dialog className="add-book" ref={addBookRef}>
        <form method="dialog" className="add-book-info" onSubmit={addBook}>
          <input type="text" placeholder="Enter the id of the book" required />
          <button type="submit">Add Book</button>
        </form>
      </dialog>
      <dialog className="make-shelf" ref={makeShelfRef}>
        <form className="make-shelf-info" method="dialog" onSubmit={makeShelf}>
          <input
            type="text"
            placeholder="Enter the name of the Shelf"
            required
          />
          <input
            type="text"
            placeholder="Enter the link of the first book"
            required
          />
          <button type="submit">Make Shelf</button>
        </form>
      </dialog>
    </main>
  );
};

export default MyLibrary;
