import React from "react";
import heroImage from '../../Asset 2.svg';
import {Link} from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
  const {currentUser} = useAuth();

  return (
    currentUser ?
    <main className="home">
      
    </main>
    :
    <section className="hero-section">
      <div className="hero-image">
        <img src={heroImage} alt="a bookshelf with books" />
      </div>
      <div className="hero-text">
        <h1 className="catchphrase">
          A library for everyone with <br /> Only{" "}
          <span className="emphasized">Free Books</span>
        </h1>
        <p>
          Read your favorite books for FREE!!! Upload some if you have any.
          This is an online library maintained by the community. Join threads of
          specific books to discuss with fellow bookworms.
        </p>
        <div className="login-btn-parent">

          <Link to="/signup"><button>Sign Up</button></Link>
          <span>Sign In</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
