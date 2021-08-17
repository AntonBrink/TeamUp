import React from "react";
import * as manageStyles from "../styles/ManagePage.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../stores/authContext";

const ManagePage = () => {
  const { user, authReady } = useContext(AuthContext);
  const [teams, setTeams] = useState();
  const [teamsReady, setTeamsReady] = useState(false);
  const [tempMembers] = useState([]);
  const [tempRequests] = useState([]);

  let teamMembers = [];
  let joinRequests = [];
  const [displayMembers, setDisplayMembers] = useState("noshowmembers");
  const [displayRequesters, setDisplayRequesters] =
    useState("noshowrequesters");

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
    creatorEmail
    memberApplications

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

  const deleteTeam = (teamId) => {
    let teamDeleteConfirm = confirm(
      "Are you sure you want to disband your team, this means it will be gone forever"
    );

    if (teamDeleteConfirm) {
      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation MyMutation($teamId : ID!) {
                    deleteTeam(where: {id : $teamId}){
                    id
}
}
`,
            variables: {
              teamId: teamId,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => console.log(result));

      location.reload();
    }
  };
  const addMember = (teamId) => {
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
    creatorEmail
    memberApplications

}

  
}`,
          variables: {
            userEmail: user.email,
          },
        }),
      }
    );
  };
  const removeMember = (teamId) => {
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
    creatorEmail
    memberApplications

}

  
}`,
          variables: {
            userEmail: user.email,
          },
        }),
      }
    );
  };

  const showFunction = (teamId) => {
    setDisplayMembers("showmembers");

    teamMembers.forEach((teamMembersArray) => {
      if (teamMembersArray.teamId == teamId) {
        teamMembersArray.members.forEach((member) => {
          tempMembers.push(member);
        });
      }
    });
  };

  const memberApplicationsFunction = (teamId) => {
    setDisplayRequesters("showrequesters");
    joinRequests.forEach((memberApplicationsArray) => {
      if (memberApplicationsArray.teamId == teamId) {
        memberApplicationsArray.members.forEach((member) => {
          tempRequests.push(member);
        });
      }
    });
  };

  return (
    <div>
      <h1>Your Teams</h1>

      {!teamsReady && <div>Loading your teams...</div>}

      {teamsReady && (
        <div>
          {teams.data.teams.map((team) => {
            teamMembers.push({ teamId: team.id, members: team.memberData });
            joinRequests.push({
              teamId: team.id,
              members: team.memberApplications,
            });

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
                {team.creatorEmail == user.email ? (
                  <div>
                    <button
                      onClick={() => {
                        deleteTeam(team.id);
                      }}
                    >
                      Disband
                    </button>
                    <button
                      onClick={() => {
                        removeMember();
                      }}
                    >
                      Remove Member
                    </button>
                    <button
                      onClick={() => {
                        addMember();
                      }}
                    >
                      Add Member
                    </button>
                    <button onClick={() => showFunction(team.id)}>
                      View Members
                    </button>
                    <button onClick={() => memberApplicationsFunction(team.id)}>
                      View Join Requests
                    </button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => showFunction(team.id)}>
                      View Members
                    </button>
                  </div>
                )}
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

        {/* sample team */}

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

      {/* sample team */}

      {/* Join Requests */}

      <div className={` manageStyles.${displayRequesters}`}>
        {tempRequests.map((requester, id) => {
          return (
            <p key={id}>
              {requester.name} - {requester.email} <button>Add</button>
              <button>Decline</button>
            </p>
          );
        })}
      </div>

      {/* Join Requests */}

      {/* add member modal */}

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

      {/* add member modal */}

      {/* remove member modal */}

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

        {/* remove member modal */}

        {/* confirmation remove */}

        <div className={manageStyles.removeConfirmation}>
          <h1>Are you sure you want to remove user with id of id1</h1>
          <button>No!</button>
          <button>Yes!</button>
        </div>
      </div>

      {/* confirmation remove */}

      {/* members */}

      <div className={` manageStyles.memberList${displayMembers}`}>
        {tempMembers.map((member, id) => {
          console.log(member);

          return <p key={id}>{member.name}</p>;
        })}
      </div>
    </div>

    // members
  );
};

export default ManagePage;
