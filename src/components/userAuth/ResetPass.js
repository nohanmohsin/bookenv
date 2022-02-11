import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const ResetPass = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return alert("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate.push("/");
      })
      .catch(() => {
        alert("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <main className="reset-pass">
      <h1>Set a Strong Password</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="reset-pass-input"
          type="text"
          placeholder="Email"
          required
          ref={emailRef}
          defaultValue={currentUser.email}
        />
        <input
          className="reset-pass-input"
          type="text"
          placeholder="Password"
          required
          ref={passwordRef}
        />
        <input
          className="reset-pass-input"
          type="text"
          placeholder="Confirm Password"
          required
          ref={passwordConfirmRef}
        />
        <button disabled={loading} type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
};

export default ResetPass;
