import Layout from "../components/layout";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useContext } from "react";
import AuthContext from "../stores/authContext";

export default function Home() {
  const { user, authReady } = useContext(AuthContext);

  useEffect(() => {
    if (authReady) {
      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query{
  teams{
    
    teamName
    
  }
  
  
}`,
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });
    }
  }, [user, authReady]);

  return (
    <div>
      <h1>Homepage</h1>
      <div>
        <div>
          <label htmlFor="">Role/Degree</label>
          <select name="" id="">
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
          </select>
        </div>
        <div>
          <label htmlFor="">Role/Degree</label>
          <select name="" id="">
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
          </select>
        </div>
        <div>
          <button>View Team(s)</button>
          <button>Create Team</button>
        </div>
      </div>

      {!authReady && <h1>Loading...</h1>}
    </div>
  );
}
