import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const MyLibrary = () => {
  const user = auth.currentUser;
  //used for showing how many books there are in your library
  const [bookCount, setBookCount] = useState(0);
  const [libData, setLibData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  // const exampleData = [
  //   {
  //     name: "Top Shelf",
  //     books: [
  //       {
  //         imageURL:
  //           "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
  //         name: "The Martian",
  //       },
  //       {
  //         imageURL:
  //           "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
  //         name: "The Martian",
  //       },
  //     ],
  //   },
  // ];
  const makeShelf = async () => {
    const userUpdateRef = await updateDoc(doc(db, "users", user.uid), {
      libData: [
        {
          shelfName: "top shelf",
          books: [
            {
              imageURL:
                "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
              name: "The Martian",
            },
            {
              imageURL:
                "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
              name: "The Martian",
            },
          ],
        },
      ],
    });
    setLibData((prevShelves) => [
      ...prevShelves,
      {
        shelfName: "top shelf",
        books: [
          {
            imageURL:
              "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
            name: "The Martian",
          },
          {
            imageURL:
              "http://books.google.com/books/publisher/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73U90AwKUanB6KJY0VMTigQCxX6UR4V07CjO5EMWG_CBObTnVRjD0oddmWT5sFarrSbrC2E7Vpf5040e7Hna7uJSaRaYbWBfjy47Ugi-7WiodiQOg9y2jcv54SgG-itB_abrlG6&source=gbs_api",
            name: "The Martian",
          },
        ],
      },
    ]);
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
    libData.map(shelf => dummyCount += shelf.books.length)
    setBookCount(dummyCount)
  }, [libData])
  return (
    <main className="my-library navbar-included">
      {/* mapping through the db data */}

      {libData.length > 0 ? (
        <>
          <h1>Your Library</h1>
          <p>You have {libData.length} {libData > 1 ? "shelves" : "shelf"} and {bookCount} books in here</p>
          <button className="make-shelf" onClick={makeShelf}>Make a Shelf</button>
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
          <button disabled={disabled} onClick={makeShelf}>
            Make a Shelf
          </button>
        </div>
      )}
    </main>
  );
};

export default MyLibrary;
