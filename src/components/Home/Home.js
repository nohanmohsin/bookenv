import React from "react";
import bookshelf from "../../illustrations/bookshelf.svg";
import manAddingBook from "../../illustrations/man adding book.svg"
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  return (
    //if the user is logged in I will show them their news feed
    currentUser ? (
      <main className="home"></main>
    ) : (
      <main className="landing-page">
        <section className="hero-section">
          <img src={bookshelf} alt="a bookshelf with books" className="hero-image"/>
          
          <div className="hero-text">
            <h1 className="catchphrase">
              A library for everyone with <br /> only{" "}
              <span className="emphasized">free books</span>
            </h1>
            <p>
              Read your favorite books for FREE!!! Upload some if you have any.
              This is an online library maintained by the community. Join
              threads of specific books to discuss with fellow bookworms.
            </p>
            <div className="login-btn-parent">
              <Link to="/explore">
                <button>Explore</button>
              </Link>
              <span>Sign In</span>
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
              Make an account and learn how to upload your book. Add a few details about the book or maybe your thoughts on it. Then share it with the whole world and earn awards!!!
            </p>
            <div className="login-btn-parent">
              <Link to="/signup">
                <button>Make An Account</button>
              </Link>
              <span>Sign In</span>
            </div>
          </div>
          <img src={manAddingBook} alt="person adding a book to a library" className="hero-image"/>
        </section>
      </main>
    )
  );
};

export default Home;
