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
  const [teamId, setTeamId] = useState("");

  const requestJoin = (id) => {
    let userData;
    teams.forEach((team) => {
      if (team.id == id) {
        userData = team.memberApplications;
      }
    });

    userData.push({ name: user.user_metadata.full_name, email: user.email });

    fetch(
      "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation UpdateTeam($id : ID!, $MemberApplications :  [Json!]){
    updateTeam(data: {memberApplications: $MemberApplications}, where: {id : $id}) {
        id
      }

    }`,
          variables: {
            id: id,
            MemberApplications: userData,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        window.alert("request to join sent");
      });
  };

  const setData = (id) => {
    setNames([]);

    teams.map((team) => {
      if (team.id == id) {
        setTeamName(team.teamName);
        setDate(team.applyEndDate);
        setDescription(team.groupDescription);
        team.memberData.forEach((member) => {
          setNames((names) => [...names, member.name]);
        });
        setTeamId(id);
      }
    });
  };

  useEffect(() => {
    if (authReady && user) {
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
    memberApplications
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
              memberApplications: team.memberApplications,
            });
          });
          setTeamsReady(true);
        });
    }
  }, [teams, user, authReady]);

  return (
    <div>
      <h1 className={styles.heading}>All Teams</h1>
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

            totalPositions += team.memberData.length;

            return (
              <button 
                key={team.id}
                onClick={() => {
                  setData(team.id);
                }}
              >
                <div>
                  <h1 className={styles.header}> {team.teamName}</h1>
                  <p>
                    {team.memberData.length}/{totalPositions} Members
                  </p>
                  <ul>
                    Members needed:
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
        {teamId ? (
          <div className={styles.teamInfo}>
            <h1>{teamName}</h1>
            <div>
              <p>Current Members:</p>
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
                <h2>Applications Closing Date:</h2>
                <p>{date}</p>
              </div>
            </div>
            <button className={styles.requestButton}
              onClick={() => {
                requestJoin(teamId);
              }}
            >
              Request to Join
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
