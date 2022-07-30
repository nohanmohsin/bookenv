import React from "react";
import logo from "../../logo.svg";
import turnOffIcon from "../../icons/turn-off-icon.svg";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
//pages to not show the navbar in
const dontShow = ["/signup", "/signin", "/resetpass", "/view"];
const Navbar = () => {
  const location = useLocation().pathname;
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const handleSearchSubmit = (e) => {
    if (e.target.value.length > 0) {
      navigate(`search=${e.target.value}`);
    }
  };
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(e);
                }
              }}
            />
            <NavLinks />
          </>
        ) : (
          <input
            type="text"
            placeholder="Search books"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
          />
        )}

        <div className="login-btn-parent">
          {user ? (
            <>
              <Link to="/account">
                <img src={auth.currentUser.photoURL} alt="" width={48} />
              </Link>
              <img
                src={turnOffIcon}
                alt=""
                onClick={logOut}
                className="sign-off"
              />
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
