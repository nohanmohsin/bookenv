import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      alert("Failed to log in");
    }

    setLoading(false);
  }
  return (
    <main className="login">
      <h1>Sign In to your Account</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="signin-input"
          type="text"
          placeholder="Email"
          required
          ref={emailRef}
        />
        <input
          className="signin-input"
          type="text"
          placeholder="Password"
          required
          ref={passwordRef}
        />
        <button disabled={loading} type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
};

export default Signin;
