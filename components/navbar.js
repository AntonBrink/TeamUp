import { useContext } from "react";
import AuthContext from "../stores/authContext";
import * as navStyle from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/router'

const Navbar = () => {
  const { user, login, logout, authReady } = useContext(AuthContext);
  const router = useRouter();

  return (
    <nav className={navStyle.navbarComponent}>
    <Image src="/eduvosLogo.png" alt="Could not find logo" className={navStyle.navImage} width="160px" height="130px" />
    <Link href='/'>
      <h1 className={navStyle.navH1}>TeamUp</h1>
    </Link>

      <ul className={navStyle.navList}>
        <li className={`${(router.pathname == '/create_team') ? navStyle.active :''} ${navStyle.navItem}`} > <Link   href='/create_team'>  Create Team </Link></li>
        <li className={`${(router.pathname == "/view_team") ? navStyle.active : ''} ${navStyle.navItem}`} ><Link href='/view_team' >View Teams</Link></li>
        <li className={`${(router.pathname == "/manage_page") ? navStyle.active : ''} ${navStyle.navItem}`}  ><Link href='/manage_page'  > My Teams</Link></li>
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
