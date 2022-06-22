import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const MyLibrary = () => {
  const user = auth.currentUser;
  //used for showing how many books there are in your library
  const [bookCount, setBookCount] = useState(0);
  const [libData, setLibData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const makeShelfRef = useRef();
  const makeShelf = async (e) => {
    e.preventDefault();
    
    const bookCheckRef = await getDoc(doc(db, "books", e.target[1].value));
    e.target[1].value = ""
    if (bookCheckRef.exists()) {
      
      const userUpdateRef = await updateDoc(doc(db, "users", user.uid), {
        libData: [
          {
            shelfName: e.target[0].value,
            books: arrayUnion({
              imageURL: bookCheckRef.imageURL,
              name: bookCheckRef.name,
              id: bookCheckRef.id,
            }),
          },
        ],
      });
      setLibData((prevShelves) => [
        ...prevShelves,
        {
          shelfName: e.target[0].value,
          books: arrayUnion({
            imageURL: bookCheckRef.imageURL,
            name: bookCheckRef.name,
            id: bookCheckRef.id,
          }),
        },
      ]);
    } else {
      alert("Wrong ID of book")
    }
    makeShelfRef.current.close()
  };
  useEffect(() => {
    const getlibData = async () => {
      const userDataRef = await getDoc(doc(db, "users", user.uid));
      if (userDataRef.data().libData) {
        setLibData(userDataRef.data().libData);
      }
      setDisabled(false);
      return;
    };
    getlibData();
  }, []);
  useEffect(() => {
    let dummyCount = 0;
    libData.map((shelf) => (dummyCount += shelf.books.length));
    setBookCount(dummyCount);
  }, [libData]);
  return (
    <main className="my-library navbar-included">
      {/* mapping through the db data */}

      {libData.length > 0 ? (
        <>
          <h1>Your Library</h1>
          <p>
            You have {libData.length} {libData > 1 ? "shelves" : "shelf"} and{" "}
            {bookCount} books in here
          </p>
          <button className="make-shelf" onClick={() => makeShelfRef.current.showModal()}>
            Make a Shelf
          </button>
          {libData.map((shelf) => (
            <section className="shelf">
              <div className="headline-and-icons-container">
                <h1>{shelf.shelfName}</h1>
                <img src={addIcon} alt="" className="add-icon" width={45} />
              </div>
              {/* mapping through the books from the individual shelf we get from db data */}
              <div className="books">
                {shelf.books.map((book) => (
                  <BookBasicDetails data={book} />
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
      <dialog className="make-shelf" ref={makeShelfRef}>
        <form className="make-shelf-info" method="dialog" onSubmit={makeShelf}>
          <input type="text" placeholder="Enter the name of the Shelf" />
          <input type="text" placeholder="Enter the link of the first book" />
          <button type="submit">Make Shelf</button>
        </form>
      </dialog>
    </main>
  );
};

export default MyLibrary;
