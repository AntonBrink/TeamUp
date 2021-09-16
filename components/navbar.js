import { useContext } from "react";
import AuthContext from "../stores/authContext";
import * as navStyle from "../styles/Navbar.module.css";
import Image from "next/image";

const Navbar = () => {
  const { user, login, logout, authReady } = useContext(AuthContext);


  return (
    <nav className={navStyle.navbarComponent}>
    <Image src="/eduvosLogo.png" alt="Could not find logo" className={navStyle.navImage} width="180px" height="150px" />
      <h1 className={navStyle.navH1}>TeamUp</h1>

      <ul className={navStyle.navList}>
        <li className={navStyle.navItem}><a> Create Team</a></li>
        <li className={navStyle.navItem}><a> View Teams</a></li>
        <li className={navStyle.navItem}><a> My Teams</a></li>
      </ul>
      {authReady &&
        (!user ? (
          <button onClick={login} className={navStyle.button}>
            Login / SignUp
          </button>
        ) : (
          <button onClick={logout} className={navStyle.button}>
            Log Out
          </button>
        ))}
    </nav>
  );
};

export default Navbar;
