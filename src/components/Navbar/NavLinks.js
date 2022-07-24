import React from "react";
import { ReactComponent as HomeIcon } from "../../icons/home-icon.svg";
import { ReactComponent as ThreadsIcon } from "../../icons/threads-icon.svg";
import { ReactComponent as UploadIcon } from "../../icons/upload-icon.svg";
import { ReactComponent as MyLibraryIcon } from "../../icons/bookshelf-icon.svg";
import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
  const { pathname } = useLocation();

  return (
    <div className="navlinks">
      <Link to={"/home"} className={(pathname === "/" || pathname === "/home") && "active"}>
        <HomeIcon
          fill={pathname === "/" || pathname === "/home" ? "#ffd675" : "#fff"}
        />
      </Link>
      <Link to={"/threads"} className={pathname.startsWith("/threads") && "active"}>
        <ThreadsIcon
          fill={pathname.startsWith("/threads") ? "#ffd675" : "#fff"}
        />
      </Link>
      <Link to={"/my-library"} className={pathname === "/my-library" && "active"}>
        <MyLibraryIcon fill={pathname === "/my-library" ? "#ffd675" : "#fff"} />
      </Link>
      <Link to={"/upload"} className={pathname === "/upload" && "active"}>
        <UploadIcon fill={pathname === "/upload" ? "#ffd675" : "#fff"} />
      </Link>
    </div>
  );
};

export default NavLinks;
