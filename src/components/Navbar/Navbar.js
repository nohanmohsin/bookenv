import React from "react";
import logo from "../../logo.svg";
import { useLocation, Link } from "react-router-dom";
//pages to not show the navbar in
const dontShow = ['/signup', '/signin', '/resetpass', '/upload'];
const Navbar = () => {
  const location = useLocation().pathname;
  if (!dontShow.includes(location)) {
    return (
      <header className="navbar">
        <img src={logo} alt="bookenv logo" height={40}/>
        <input type="text" placeholder="Search books" />
        <div className="login-btn-parent">
          <span>Sign In</span>
          <Link to="/signup"><button>Sign Up</button></Link>
        </div>
      </header>
    );
  } 
  return null;
};

export default Navbar;
