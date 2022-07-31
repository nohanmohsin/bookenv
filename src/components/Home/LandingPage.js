import React from "react";
import { Link } from "react-router-dom";
import bookshelf from "../../illustrations/bookshelf.svg";
import manAddingBook from "../../illustrations/man adding book.svg";

const LandingPage = () => {
  return (
    <main className="landing-page navbar-included">
      <section className="hero-section">
        <img
          src={bookshelf}
          alt="a bookshelf with books"
          className="hero-image"
        />

        <div className="hero-text">
          <h1 className="catchphrase">
            A library for everyone with <br /> only{" "}
            <span className="emphasized">free books</span>
          </h1>
          <p>
            Read your favorite books for FREE!!! Upload some if you have any.
            This is an online library maintained by the community. Join threads
            of specific books to discuss with fellow bookworms.
          </p>
          <div className="login-btn-parent">
            <Link to="/signin">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="become-contributor hero-section">
        <div className="hero-text">
          <h1 className="catchphrase">
            Become a Contributor to share your <br />
            favourite books
          </h1>
          <p>
            Make an account and learn how to upload your book. Add a few details
            about the book or maybe your thoughts on it. Then share it with the
            whole world and earn awards!!!
          </p>
          <div className="login-btn-parent">
            <Link to="/signup">
              <button>Make An Account</button>
            </Link>
            <Link to="/signin">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
        <img
          src={manAddingBook}
          alt="person adding a book to a library"
          className="hero-image"
        />
      </section>

      <section className="keep-reading">
        <h1 className="emphasized">Or</h1>
        <h1>Just keep on reading!!</h1>
        <p>
          You are always free to just read the books available in our
          website...open up the book and read as much as you want and we'll save
          your progress and (if you want) we'll tell others about it. You can
          also earn awards from reading your favourite books too
        </p>
      </section>
    </main>
  );
};

export default LandingPage;
