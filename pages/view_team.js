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
  const [openRoles, setOpenRoles] = useState([]);
  const [applyRole, setApplyRole] = useState("other");
  const [applyYear, setApplyYear] = useState("other");
  const [userYear, setUserYear] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [firstRun, setFirstRun] = useState(2);

  const requestJoin = (id) => {
    let userData;
    teams.forEach((team) => {
      if (team.id == id) {
        userData = team.memberApplications;
      }
    });

    userData.push({
      name: user.user_metadata.full_name,
      email: user.email,
      userYear: userYear,
      role: applyRole,
      year: applyYear,
    });

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
    setOpenRoles([]);

    teams.map((team) => {
      if (team.id == id) {
        setTeamName(team.teamName);
        setDate(team.applyEndDate);
        setDescription(team.groupDescription);
        team.memberData.forEach((member) => {
          setNames((names) => [...names, member.name]);
        });
        setTeamId(id);

        team.openPositions.forEach((openPosition) => {
          setOpenRoles((openRoles) => [...openRoles, openPosition]);
        });
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

  useEffect(() => {
    if (firstRun > 1) {
      setFirstRun(1);
      console.log(firstRun);

      return;
    }
    console.log("after first run");

    setTeamsReady(true);
  }, [filterRole, filterYear]);

  return (
    <div>
      <h1 className={styles.heading}>View Available Teams</h1>
      <div>
        <div>
          <h2 className={styles.filters}>Filter Teams:</h2>
          <label className={styles.filterLabel} htmlFor="">Role/Degree</label>
          <select className={styles.filterSelect}
            onChange={(e) => {
              setTeamsReady(false);

              setFilterRole(e.target.value);
            }}
          >
            <option value="All">All </option>
            <option value="BA">BA</option>
            <option value="It">Bsc IT</option>
            <option value="Bcom">Bcom</option>
          </select>
        </div>
        <div>
          <label className={styles.filterLabel} htmlFor="">Year</label>
          <select className={styles.filterSelect}
            onChange={(e) => {
              setTeamsReady(false);

              setFilterYear(e.target.value);
            }}
          >
            <option value="All">All</option>
            <option value="1">1st </option>
            <option value="2">2nd </option>
            <option value="3">3rd </option>
          </select>
        </div>
      </div>

      {!authReady && <h1>Loading...</h1>}
      {!teamsReady && <h1>Loading teams...</h1>}

      {teamsReady && (
        <div className={styles.pageContent}>
          <div className={styles.teams}>
            {teams.map((team) => {
              let totalPositions = 0;

              let containsYear = false;
              let containsRole = false;

              team.openPositions.forEach((openPosition) => {
                totalPositions += parseInt(openPosition.Amount);

                let thisPositionRole = openPosition.Role.toLowerCase();
                let checkRole = filterRole.toLowerCase();

                if (thisPositionRole.includes(checkRole)) {
                  containsRole = true;

                  if (openPosition.Years == filterYear) {
                    containsYear = true;
                  }
                }

                if (filterRole == "All") {
                  if (openPosition.Years == filterYear) {
                    containsYear = true;
                  }
                }
              });

              if (filterRole == "All") {
                containsRole = true;
              }

              if (filterYear == "All") {
                containsYear = true;
              }

              if (!containsRole) {
                return;
              }
              if (!containsYear) {
                return;
              }

              totalPositions += team.memberData.length;

              if (team.memberData.length === totalPositions) {
                return;
              }

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
                      {team.memberData.length}/{totalPositions} Members
                    </p>
                    <ul>
                      Members needed:
                      {team.openPositions.map((openPosition, id) => {
                        return (
                          <li key={id}>
                            {openPosition.Amount} {openPosition.Role}(s) Year:{" "}
                            {openPosition.Years}
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
                  <h2>Applications Closing Date</h2>
                  <p>{date}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    requestJoin(teamId);
                  }} className={styles.requestButton}
                >
                  Request to Join
                </button>
                <label className={styles.roleLabel}>Role: </label>
                
                <select className={styles.selectList}
                  onChange={(e) => {
                    let role = "other";
                    let year = "All";
                    let input = e.target.value;

                    setApplyRole(role);
                    setApplyRole(year);

                    openRoles.forEach((openRole) => {
                      if (input.includes(openRole.Role)) {
                        role = openRole.Role;
                        setApplyRole(role);
                      }

                      if (input.includes(openRole.Years)) {
                        year = openRole.Years;
                        setApplyYear(year);
                      }
                    });

                    // setApplyRole(e.target.value);
                  }}
                >
                  <option value="other">Other</option>

                  {openRoles.map((openRole, id) => {
                    let value = openRole.Role + " - " + openRole.Years;

                    {
                      if (openRole.Years === "All") {
                        return (
                          <option value={value} key={id}>
                            {openRole.Role} - {openRole.Years} Years
                          </option>
                        );
                      } else {
                        return (
                          <option value={value} key={id}>
                            {openRole.Role} - {openRole.Years}rd Year
                          </option>
                        );
                      }
                    }
                  })}
                </select>
                <label className={styles.yearLabel}>
                Your Year:
                </label>
                <select className={styles.selectList}
                  onChange={(e) => {
                    setUserYear(e.target.value);
                  }}
                >
                  <option value="other">Other</option>

                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                </select>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
