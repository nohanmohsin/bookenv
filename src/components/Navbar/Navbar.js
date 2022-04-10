import React from "react";
import logo from "../../logo.svg";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import NavLinks from "./NavLinks";
//pages to not show the navbar in
const dontShow = ["/signup", "/signin", "/resetpass", "/upload", "/view"];
const Navbar = () => {
  const location = useLocation().pathname;
  const user = auth.currentUser;
  const { logOut } = useAuth();
  if (!dontShow.includes(location) && !location.startsWith("/view")) {
    return (
      <nav className="navbar">
        <img src={logo} alt="bookenv logo" height={40} />
        {user ? (
          <>
            <input
              type="text"
              className="user-search"
              placeholder="Search books"
            />
            <NavLinks />
          </>
        ) : (
          <input type="text" placeholder="Search books" />
        )}

        <div className="login-btn-parent">
          {user ? (
            <>
              <Link to="/account">
                <img
                  src="https://yt3.ggpht.com/ytc/AKedOLQFCSVrqjFIW4_wDf-XAB60ze8RHm-zE-c3oVe0=s88-c-k-c0x00ffffff-no-rj-mo"
                  alt=""
                  width={48}
                />
              </Link>
              <span onClick={logOut}>Sign Out</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <Link to="/signup">
                <button>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  }
  return null;
};

export default Navbar;
