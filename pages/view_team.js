import styles from "../styles/viewTeams.module.css";
import Link from "next/link";

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../stores/authContext";

export default function Home() {
  const { user, authReady } = useContext(AuthContext);
  const [teams] = useState([]);
  const [teamsReady, setTeamsReady] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [names, setNames] = useState([]);
  const [date, setDate] = useState("");
  const [goAhead, setGoAhead] = useState(false);

  const setData = (id) => {
    setNames([]);

    teams.map((team) => {
      if (team.id == id) {
        setTeamName(team.teamName);
        setDate(team.applyEndDate);
        setDescription(team.groupDescription);
        team.memberData.forEach((member) => {
          console.log(member);
          setNames((names) => [...names, member.name]);
        });
      }
    });
  };

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
    openPositions
    memberData
    applyEndDate
    groupDescription
  
}

  
}`,
            variables: {},
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          result.data.teams.forEach((team) => {
            teams.push({
              id: team.id,
              teamName: team.teamName,
              memberData: team.memberData,
              openPositions: team.openPositions,
              applyEndDate: team.applyEndDate,
              groupDescription: team.groupDescription,
            });
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
      </div>

      {!authReady && <h1>Loading...</h1>}
      {!teamsReady && <h1>Loading teams...</h1>}

      <div className={styles.pageContent}>
        <div className={styles.teams}>
          {teams.map((team) => {
            let totalPositions = 0;

            team.openPositions.forEach((openPosition) => {
              totalPositions += parseInt(openPosition.Amount);
            });

            return (
              <button
                key={team.id}
                onClick={() => {
                  setData(team.id);
                }}
              >
                <div>
                  <h1> {team.teamName}</h1>
                  <p>
                    {team.memberData.length}/{totalPositions} members
                  </p>
                  <ul>
                    Member(s) needed:
                    {team.openPositions.map((openPosition, id) => {
                      return (
                        <li key={id}>
                          {openPosition.Amount} {openPosition.Role}(s)
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.teamInfo}>
          <h1>{teamName}</h1>
          <div>
            <p></p>
            <ul>
              {names.map((name, id) => {
                return <li key={id}>{name}</li>;
              })}
            </ul>
            <div>
              <h2>Team Description:</h2>
              <p>{description}</p>
            </div>
            <div>
              <h2>Applications Closing Date</h2>
              <p>{date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
