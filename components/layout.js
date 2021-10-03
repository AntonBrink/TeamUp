import { Children } from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import * as layoutStyle from "../styles/layout.module.css";
const Layout = ({ children }) => {
  return (
    <div className={layoutStyle.layoutDiv} >
      <Navbar></Navbar>
      <main className={layoutStyle.main} >{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
