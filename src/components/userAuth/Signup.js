import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return alert("Passwords do not match");
    }

    try {
      
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      alert("Failed to create an account");
    }

    setLoading(false);
  }
  return (
    <main className="signup">
      <h1>Create an Account</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="text"
          placeholder="Email"
          required
          ref={emailRef}
        />
        <input
          className="signup-input"
          type="text"
          placeholder="Password"
          required
          ref={passwordRef}
        />
        <input
          className="signup-input"
          type="text"
          placeholder="Confirm Password"
          required
          ref={passwordConfirmRef}
        />
        <button disabled={loading} type="submit">
          Sign Up
        </button>
      </form>
    </main>
  );
};

export default Signup;