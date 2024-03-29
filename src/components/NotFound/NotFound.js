import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = ({ errorName }) => {
  let errorMsg = "";
  switch (errorName) {
    case "book":
      errorMsg = "No Book was found";
      break;
    case "contributer":
      errorMsg = "No such User was found";
      break;
    case "thread":
      errorMsg = "No such Thread was found";
      break;
    default:
      errorMsg = "Nothing was found";
  }
  useEffect(() => {
    document.title = "Nothing was found"
  }, [])
  return (
    <main className="not-found navbar-included">
      <h1 className="emphasized">404</h1>
      <h1>{errorMsg}</h1>
      <Link to="/">
        <span>Return Home</span>
      </Link>
    </main>
  );
};

export default NotFound;
