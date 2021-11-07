import { useContext } from "react";
import AuthContext from "../stores/authContext";
import * as navStyle from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBars } from "react-icons/fa";
import { GoSignIn, GoSignOut } from "react-icons/go";
import React, { useState } from "react";

const Navbar = () => {
  const { user, login, logout, authReady } = useContext(AuthContext);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  let menu;

  if (showMenu) {
    menu = (
      <div className={navStyle.navSidebar}>
        <ul id="idNavListHamburger" className={navStyle.navListHamburger}>
          <li
            className={`${
              router.pathname == "/manage_page" ? navStyle.active : ""
            } ${navStyle.navItemHamburger}`}
          >
            <Link href="/"> Home</Link>
          </li>
          <li
            className={`${
              router.pathname == "/create_team" ? navStyle.active : ""
            } ${navStyle.navItemHamburger}`}
          >
            {" "}
            <Link href="/create_team"> Create Team </Link>
          </li>
          <li
            className={`${
              router.pathname == "/view_team" ? navStyle.active : ""
            } ${navStyle.navItemHamburger}`}
          >
            <Link href="/view_team">View Teams</Link>
          </li>
          <li
            className={`${
              router.pathname == "/manage_page" ? navStyle.active : ""
            } ${navStyle.navItemHamburger}`}
          >
            <Link href="/manage_page"> My Teams</Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <nav className={navStyle.navbarComponent}>
      <span className="text-xl">
        <FaBars
          icon={FaBars}
          className={navStyle.menuIcon}
          onClick={() => setShowMenu(!showMenu)}
        ></FaBars>
      </span>
      {menu}

      <Image
        src="/eduvosLogo.png"
        alt="Could not find logo"
        className={navStyle.navImage}
        width="160px"
        height="130px"
      />

      <Link href="/">
        <h1 className={navStyle.navH1}>TeamMeUp</h1>
      </Link>

      <ul className={navStyle.navList}>
        <li
          className={`${
            router.pathname == "/create_team" ? navStyle.active : ""
          } ${navStyle.navItem}`}
          onClick={() => setShowMenu(!showMenu)}
        >
          {" "}
          <Link href="/create_team"> Create Team </Link>
        </li>
        <li
          className={`${
            router.pathname == "/view_team" ? navStyle.active : ""
          } ${navStyle.navItem}`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Link href="/view_team">View Teams</Link>
        </li>
        <li
          className={`${
            router.pathname == "/manage_page" ? navStyle.active : ""
          } ${navStyle.navItem}`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Link href="/manage_page"> My Teams</Link>
        </li>
      </ul>

      {authReady &&
        (!user ? (
          <button onClick={login} className={navStyle.button}>
            <span className={navStyle.logText}>Login / SignUp</span>{" "}
            <GoSignIn className={navStyle.logIcon} />
          </button>
        ) : (
          <button onClick={logout} className={navStyle.button}>
            <span className={navStyle.logText}>
              {user.user_metadata.full_name}
            </span>{" "}
            <GoSignOut className={navStyle.logIcon} />
          </button>
        ))}
    </nav>
  );
};
export default Navbar;
