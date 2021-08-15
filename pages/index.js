import styles from "../styles/Home.module.css";
import Link from "next/link";

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../stores/authContext";

export default function Home() {
  const { user, authReady } = useContext(AuthContext);
  const [teams] = useState([]);
  const [teamsReady, setTeamsReady] = useState(false);

  useEffect(() => {
    if (authReady && user) {
      console.log(user);
      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query{

  teams {
    teamName
    id
  
}

  
}`,
            variables: {},
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          result.data.teams.forEach((team) => {
            teams.push(<p key={team.id}>{team.teamName}</p>);
          });
          setTeamsReady(true);
        });
    }
  }, [teams, user, authReady]);

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
          <Link href="manage_page">View Team(s)</Link>
          <Link href="create_team">Create Team</Link>
        </div>
      </div>

      {!authReady && <h1>Loading...</h1>}
      {!teamsReady && <h1>Loading teams...</h1>}

      {teams.map((team, id) => {
        return <h1 key={id}>{team}</h1>;
      })}
    </div>
  );
}
