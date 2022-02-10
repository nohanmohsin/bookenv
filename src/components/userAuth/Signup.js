import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()
  
    async function handleSubmit(e) {
      e.preventDefault()
  
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match")
      }
  
      try {
        setError("")
        setLoading(true)
        await signup(emailRef.current.value, passwordRef.current.value)
        navigate("/")
      } catch {
        setError("Failed to create an account")
      }
  
      setLoading(false)
    }
    return (
        <main className="signup">
            <h1>Create an Account</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input className="signup-input" type="text" placeholder="Email" ref={emailRef}/>
                <input className="signup-input" type="text" placeholder="Password" ref={passwordRef}/>
                <input className="signup-input" type="text" placeholder="Confirm Password" ref={passwordConfirmRef}/>
                <button disabled={loading} type="submit">
					Register
                </button>
            </form>

        </main>
    );
};

export default Signup;