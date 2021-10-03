import { useContext } from "react";
import AuthContext from "../stores/authContext";
import * as navStyle from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from 'next/link';

const Navbar = () => {
  const { user, login, logout, authReady } = useContext(AuthContext);


  return (
    <nav className={navStyle.navbarComponent}>
    <Image src="/eduvosLogo.png" alt="Could not find logo" className={navStyle.navImage} width="160px" height="130px" />
    <Link href='/'>
      <h1 className={navStyle.navH1}>TeamUp</h1>
    </Link>

      <ul className={navStyle.navList}>
        <li className={navStyle.navItem}><Link href='/create_team'><a> Create Team</a></Link></li>
        <li className={navStyle.navItem}><Link href='/view_team'><a> View Teams</a></Link></li>
        <li className={navStyle.navItem}><Link href='/manage_page'><a> My Teams</a></Link></li>
      </ul>
      {authReady &&
        (!user ? (
          <button onClick={login} className={navStyle.button}>
            Login / SignUp
          </button>
        ) : (
          <button onClick={logout} className={navStyle.button} >
            Log Out
          </button>
        ))}
    </nav>
  );
};

export default Navbar;
