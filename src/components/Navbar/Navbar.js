import React from "react";
import { useLocation, Link } from "react-router-dom";
//pages to not show the navbar in
const dontShow = ['/signup', '/signin', '/resetpass', '/upload'];
const Navbar = () => {
  const location = useLocation().pathname;
  if (!dontShow.includes(location)) {
    return (
      <nav className="navbar">
        <h1 className="logo">Logo</h1>
        <input type="text" placeholder="Search books" />
        <div className="login-btn-parent">
          <span>Sign In</span>
          <Link to="/signup"><button>Sign Up</button></Link>
        </div>
      </nav>
    );
  } 
  return null;
};

export default Navbar;
