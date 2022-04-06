import React from "react";
import homeIcon from "../../icons/home-icon.svg";
import threadsIcon from "../../icons/threads-icon.svg";
import notificationsIcon from "../../icons/notification-icon.svg";
import uploadIcon from "../../icons/upload-icon.svg";
import myLibraryIcon from "../../icons/bookshelf-icon.svg";
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <div className="navlinks">
      <Link to={"/home"}>
        <img src={homeIcon} alt="home icon" height={40} />
      </Link>
      <Link to={"/threads"}>
        <img src={threadsIcon} alt="threads icon" height={40} />
      </Link>
      <Link to={"/notifications"}>
        <img src={notificationsIcon} alt="notifications icon" height={40} />
      </Link>
      <Link to={"/upload"}>
        <img src={uploadIcon} alt="upload icon" height={40} />
      </Link>
      <Link to={"/my-library"}>
        <img src={myLibraryIcon} alt="my library icon" height={40} />
      </Link>
    </div>
  );
};

export default NavLinks;
