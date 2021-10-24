import * as indexStyle from "../styles/Index.module.css";
import Image from "next/image";
import Link from 'next/link';



const IndexPage = () => {
  return(
    <div className = {indexStyle.pageDiv}>
      <div className = {indexStyle.leftDiv}>
        <h1 className = {indexStyle.quote}> Create Teams,</h1>
        <h1 className = {indexStyle.quote}> Join Others,</h1>
        <h1 className = {indexStyle.quote}> Meet New People.</h1>

        <div className = {indexStyle.buttonsDiv}>
        <Link href='/create_team'>
          <button className = {indexStyle.button}> Create Teams</button>
        </Link>
        <Link href='/view_team'>
          <button className = {indexStyle.button}> View Teams</button>
        </Link>
        </div>
      </div>
      <div className = {indexStyle.rightDiv}>
        <Image src="/office.png" alt="Could not find logo" className={indexStyle.image} layout="responsive" width = "250px" height = "200px"/>
      </div>
    </div>

  );
};
export default IndexPage;