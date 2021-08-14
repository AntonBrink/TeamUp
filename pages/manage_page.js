import React from "react";
import * as manageStyles from "../styles/ManagePage.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../stores/authContext";

const ManagePage = () => {
  const { user, authReady } = useContext(AuthContext);
  const [teams, setTeams] = useState();
  const [teamsReady, setTeamsReady] = useState(false);

  useEffect(() => {
    if (authReady && user) {
      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query($userEmail : String!){

  teams (where: {hiddenDesc_contains : $userEmail}){
    teamName
    id
    memberData
    openPositions
}

  
}`,
            variables: {
              userEmail: user.email,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setTeams(result);
          setTeamsReady(true);
        });
    }
  }, [user, authReady]);

  const deleteTeam = () => {};

  return (
    <div>
      <h1>Your Teams</h1>

      {!teamsReady && <div>Loading your teams...</div>}

      {teamsReady && (
        <div>
          {teams.data.teams.map((team) => {
            let totalPositions = 0;

            team.openPositions.forEach((openPosition) => {
              totalPositions += openPosition.Amount;
            });

            totalPositions = totalPositions + team.memberData.length;

            return (
              <div key={team.id}>
                <h2>{team.teamName}</h2>
                <p>
                  {team.memberData.length}/{totalPositions} members
                </p>
                <ul>
                  Member(s) needed:{" "}
                  {team.openPositions.map((openPosition, id) => {
                    return (
                      <li key={id}>
                        {openPosition.Amount} {openPosition.Role}(s)
                      </li>
                    );
                  })}
                </ul>
                <div>
                  <button
                    onClick={() => {
                      deleteTeam();
                    }}
                  >
                    Disband
                  </button>
                  <button>Remove Member</button>
                  <button>Add Member</button>
                  <button>View Members</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <div>
          <h2>TeamName</h2>
          <p>2/5 members</p>
          <p>Member(s) needed</p>
        </div>

        <div>
          <button
            onClick={() => {
              deleteTeam();
            }}
          >
            Disband
          </button>
          <button>Remove Member</button>
          <button>Add Member</button>
          <button>View Members</button>
        </div>
        <span>
          <p>1 Software Developer(s) 3rd Year</p>
          <p>1 BA Student(s) Any Year</p>
          <p>1 Law Student(s) 3rd Year</p>
        </span>
      </div>

      <div className={manageStyles.addModal}>
        <h2>TeamName</h2>

        <form action="">
          <div>
            <label htmlFor="">Member Name</label>
            <label htmlFor="">Member ID(must be unique)</label>
            <label htmlFor="">Member Role/Degree</label>
          </div>
          <div>
            <input type="text" />
            <input type="text" />
            <select name="" id="">
              <option value="">Software Developer</option>
              <option value="">Law Student</option>
              <option value="">BA Student</option>
            </select>
          </div>
          <button>Add Member</button>
        </form>
      </div>

      <div className={manageStyles.removeModal}>
        <h2>TeamName</h2>

        <form action="">
          <div>
            <label htmlFor="">Member ID(must be unique)</label>
            <label htmlFor="">Member Role/Degree</label>
          </div>
          <div>
            <input type="text" />
            <select name="" id="">
              <option value="">Software Developer</option>
              <option value="">Law Student</option>
              <option value="">BA Student</option>
            </select>
          </div>
          <button>Remove Member</button>
        </form>

        <div className={manageStyles.removeConfirmation}>
          <h1>Are you sure you want to remove user with id of id1</h1>
          <button>No!</button>
          <button>Yes!</button>
        </div>
      </div>

      <div className={manageStyles.memberList}>
        <p>Member 1</p>
        <p>Member 2</p>
      </div>
    </div>
  );
};

export default ManagePage;
