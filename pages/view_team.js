import styles from "../styles/viewTeams.module.css";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../stores/authContext";

export default function Home() {
  const { user, authReady } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
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

  const [showBlur, setShowBlur] = useState("noShowBlur");
  const [showBlur2, setShowBlur2] = useState("noShowBlur");

  const mainPageBlur =
    showBlur == "noShowBlur"
      ? `${styles.noMainPageBlur}`
      : `${styles.mainPageBlur}`;

  const smallPageBlur =
    showBlur2 == "noShowBlur"
      ? `${styles.noSmallPageBlur}`
      : `${styles.smallPageBlur}`;

  console.log(showBlur);
  console.log(showBlur2);
  console.log(mainPageBlur);
  console.log(smallPageBlur);

  const [notification, setNotification] = useState("noShowNotification");
  const notificationClass =
    notification == "noShowNotification"
      ? `${styles.noShowNotification}`
      : `${styles.showNotification}`;

  const [displayTeamInfo, setShowTeamInfo] = useState("noShowTeamInfo");
  const teamInfo =
    displayTeamInfo == "noShowTeamInfo"
      ? `${styles.noShowTeamInfo}`
      : `${styles.teamInfo}`;

  const requestJoin = (id) => {
    let userData = [];

    teams.forEach((team) => {
      if (team.id == id) {
        fetch(
          "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `query($id : ID!){

  teams (where: {id : $id}){
    memberData
}

  
}`,
              variables: {
                id: id,
              },
            }),
          }
        )
          .then((res) => res.json())
          .then((result) => {
            userData = result.data.teams.memberData;
          });
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
        setShowBlur("showBlur");
        setNotification("showNotification");
        console.log(mainPageBlur);
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
          setTeams([]);

          result.data.teams.forEach((team) => {
            setTeams((teams) => [
              ...teams,
              {
                id: team.id,
                teamName: team.teamName,
                memberData: team.memberData,
                openPositions: team.openPositions,
                applyEndDate: team.applyEndDate,
                groupDescription: team.groupDescription,
                memberApplications: team.memberApplications,
              },
            ]);
          });
          setTeamsReady(true);
        });
    }
  }, [user, authReady]);

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
    <div className={styles.wholePage}>
      <div className={notificationClass}>
        <button
          className={styles.closeButton}
          onClick={() => {
            setNotification("noShowNotification");
            setShowBlur("noShowBlur");
            setShowBlur2("noShowBlur");
          }}
        >
          X
        </button>
        <h2>Your join request has been sent</h2>
      </div>
      <div
        className={mainPageBlur}
        onClick={() => {
          setShowBlur("noShowBlur");
          setNotification("noShowNotification");
          setShowTeamInfo("noShowTeamInfo");
        }}
      ></div>

      <div
        className={smallPageBlur}
        onClick={() => {
          setShowBlur2("noShowBlur");
          setShowBlur("noShowBlur");
          setNotification("noShowNotification");
          setShowTeamInfo("noShowTeamInfo");
        }}
      ></div>

      <h1 className={styles.heading}>View Available Teams</h1>
      <div>
        <div>
          <h2 className={styles.filters}>Filter Teams:</h2>
          <label className={styles.filterLabel} htmlFor="">
            Role/Degree
          </label>
          <select
            className={styles.filterSelect}
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
          <label className={styles.filterLabel} htmlFor="">
            Year
          </label>
          <select
            className={styles.filterSelect}
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
                    setShowTeamInfo("teamInfo");
                    setShowBlur2("showBlur");
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
            <div className={teamInfo}>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowTeamInfo("noShowTeamInfo");
                  setShowBlur("noShowBlur");
                  setShowBlur2("noShowBlur");
                }}
              >
                X
              </button>

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
                  }}
                  className={styles.requestButton}
                >
                  Request to Join
                </button>
                <label className={styles.roleLabel}>Role: </label>

                <select
                  className={styles.selectList}
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
                <label className={styles.yearLabel}>Your Year:</label>
                <select
                  className={styles.selectList}
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
