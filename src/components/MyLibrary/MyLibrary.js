import React from "react";
import addIcon from "../../icons/add-icon.svg";
import BookBasicDetails from "../BookBasicDetails/BookBasicDetails";

const MyLibrary = () => {
  const exampleData = [
    {
      name: "Top Shelf",
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
  ];
  return (
    <main className="my-library navbar-included">
      {/* mapping through the db data */}
      {exampleData ? (
        exampleData.map((data) => (
          <section className="shelf">
            <div className="headline-and-icons-container">
              <h1>{data.name}</h1>
              <img src={addIcon} alt="" className="add-icon" width={45} />
            </div>
            {/* mapping through the books from the individual shelf we get from db data */}
            <div className="books">
              {data.books.map((book) => (
                <BookBasicDetails data={book} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p>Loading..</p>
      )}
    </main>
  );
};

export default MyLibrary;
