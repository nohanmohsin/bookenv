import React from "react";

const Home = () => {
  return (
    <section className="hero-section">
      <div className="hero-image"></div>
      <div className="hero-text">
        <h1 className="catchphrase">
          A library for everyone with Only{" "}
          <span className="emphasized">Free Books</span>
        </h1>
        <p>
          Read your favourite books for FREE!!! Upload some if you have any.
          This is an online library maintained by the community. Join threads of
          specific books to discuss with fellow bookworms.
        </p>
        <div className="login-btn-parent">
          <button>Sign Up</button>
          <span>Sign In</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
