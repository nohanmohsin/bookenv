import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return alert("Passwords do not match");
    }

    try {
      
      setLoading(true);
      await signup(usernameRef.current.value, emailRef.current.value, passwordRef.current.value);
      setLoading(false);
    } catch {
      alert("Failed to create an account");
      setLoading(false);
    }

    
  }
  return (
    <main className="signup">
      <h1>Create an Account</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="text" className="signup-input" placeholder="Username" ref={usernameRef} maxLength={30}/>
        <input
          className="signup-input"
          type="text"
          placeholder="Email"
          required
          ref={emailRef}
        />
        <input
          className="signup-input"
          type="password"
          minLength={8}
          placeholder="Password"
          required
          ref={passwordRef}

        />
        <input
          className="signup-input"
          type="password"
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
