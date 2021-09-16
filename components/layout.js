import { Children } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
