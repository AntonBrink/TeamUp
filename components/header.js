import { useContext } from "react";
import AuthContext from "../stores/authContext";

const Header = () => {
  const { user, login, logout, authReady } = useContext(AuthContext);

  return (
    <header>
      <h1>Eduvos Heading</h1>

      {authReady &&
        (user ? (
          <button onClick={login} className="btn">
            Login/SignUp
          </button>
        ) : (
          <button onClick={logout} className="btn">
            Log Out
          </button>
        ))}
    </header>
  );
};

export default Header;
