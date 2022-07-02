import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const MyLibrary = () => {
  const user = auth.currentUser;
  //used for showing how many books there are in your library
  const [bookCount, setBookCount] = useState(0);
  const [libData, setLibData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  //used for adding books
  const [shelfID, setShelfID] = useState();
  const addBookRef = useRef();
  const makeShelfRef = useRef();
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
  const removeBook = async (shelfID, bookData) => {
    await updateDoc(doc(db, `users/${user.uid}/libData/${shelfID}`), {
      books: arrayRemove({
        imageURL: bookData.imageURL,
        name: bookData.name,
        id: bookData.id,
      }),
    });
    const newShelves = [...libData];
    const activeShelf = newShelves.find((shelf) => shelf.shelfID === shelfID);
    const newBooks = activeShelf.books.filter(book => book.id !== bookData.id);
    newShelves.find((shelf) => shelf.shelfID === shelfID).books = newBooks;
    setLibData(newShelves);
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
        setLibData(libDataDummy);
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
            <section className="shelf">
              <div className="headline-and-icons-container">
                <h1>{shelf.shelfName}</h1>
                <img
                  src={addIcon}
                  alt=""
                  className="add-icon"
                  width={45}
                  onClick={() => {
                    addBookRef.current.showModal();
                    setShelfID(shelf.shelfID);
                  }}
                />
              </div>
              {/* mapping through the books from the individual shelf we get from db data */}
              <div className="books">
                {shelf.books.map((book) => (
                  <div className="book-container">
                    <Link to={`/${book.id}`}>
                      <BookBasicDetails data={book} />
                    </Link>
                    <div
                      className="remove-book"
                      onClick={() => removeBook(shelf.shelfID, book)}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
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
