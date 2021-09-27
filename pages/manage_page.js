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
  const [memberToRemove, setMemberToRemove] = useState("");
  const [removeGroup] = useState([]);
  const [tempId, setTempId] = useState("");
  const [tempAddId, setTempAddId] = useState("");
  const [openRoles, setOpenRoles] = useState([]);
  const [memberToAddInfo, setMemberToAddInfo] = useState({
    name: "",
    role: "",
    year: "",
    email: "",
  });

  let teamMembers = [];
  let joinRequests = [];
  const [displayRemoveModal, setShowRemoveModal] =
    useState("noShowRemoveModal");
  const [displayShowAddModal, setDisplayShowAddModal] =
    useState("noShowAddModal");
  const [displayMembers, setDisplayMembers] = useState("noshowmembers");
  const [displayRequesters, setDisplayRequesters] =
    useState("noshowrequesters");

  const removeClassname =
    displayRemoveModal == "noShowRemoveModal"
      ? `${manageStyles.noShowRemoveModal}`
      : `${manageStyles.showRemoveModal}`;

  const showMembersClassname =
    displayMembers == "noshowmembers"
      ? `${manageStyles.noshowmembers}`
      : `${manageStyles.showmembers}`;

  const showRequestersClassname =
    displayRequesters == "noshowrequesters"
      ? `${manageStyles.noshowrequesters}`
      : `${manageStyles.showrequesters}`;

  const addClassname =
    displayShowAddModal == "noShowAddModal"
      ? `${manageStyles.noShowAddModal}`
      : `${manageStyles.showAddModal}`;

  useEffect(() => {
    if (tempAddId !== "") {
      fetchRoles().then((response) => {
        console.log(response);
        setOpenRoles(response.data.teams[0].openPositions);
      });
    }
  }, [tempAddId]);

  useEffect(() => {
    if (openRoles.length !== 0) {
      setDisplayShowAddModal("showAddModal");
      console.log(openRoles);
    }
  }, [openRoles]);

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
      );

      location.reload();
    }
  };

  const createAddModal = (teamId) => {
    setTempAddId(teamId);
  };
  const fetchRoles = async () => {
    console.log(tempAddId);

    const response = await fetch(
      "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query($tempId : ID!){

  teams (where: {id : $tempId}){
    openPositions
}

  
}`,
          variables: {
            tempId: tempAddId,
          },
        }),
      }
    );

    const openPositions = await response.json();
    return openPositions;
  };

  const fetchMembers = async () => {
    console.log("Fetching");
    console.log(tempAddId);

    const response = await fetch(
      "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query($tempId : ID!){

  teams (where: {id : $tempId}){
    memberData
}

  
}`,
          variables: {
            tempId: tempAddId,
          },
        }),
      }
    );

    const memberData = await response.json();
    console.log(memberData);

    return memberData;
  };

  const addMember = (memberInfo) => {
    let newRoles = [];

    if (memberInfo.role == "") {
      memberInfo.role = "other";
    } else {
      openRoles.map((role) => {
        if (role.Role == memberInfo.role) {
          if (role.Amount > 1) {
            let tempAmount = parseInt(role.Amount) - 1;

            role.Amount = tempAmount.toString();
          } else {
            return;
          }
        }
        console.log(role);
        console.log(role.Amount);
        newRoles.push(role);
      });
    }

    let hiddenDesc = "";
    let newGroup = [];
    let myInfo = [];

    fetchMembers().then((memberData) => {
      myInfo = memberData;
      newGroup = myInfo.data.teams[0].memberData;
      newGroup.push(memberInfo);
      newGroup.map((member) => {
        hiddenDesc += member.email;
        hiddenDesc += ",";
      });

      if (memberInfo.role == "other") {
        newRoles = openRoles;
      }

      console.log("before new roles log");

      console.log(newRoles);

      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `mutation UpdateTeam($id : ID!, $groupData :  [Json!], $hiddenDescription : String!, $openRoles : [Json!]){
    updateTeam(data: {memberData: $groupData, hiddenDesc: $hiddenDescription, openPositions: $openRoles}, where: {id : $id}) {
        id
      }

    }`,
            variables: {
              id: tempAddId,
              groupData: newGroup,
              hiddenDescription: hiddenDesc,
              openRoles: newRoles,
            },
          }),
        }
      );
    });
  };

  const CreateRemoveModal = (teamId) => {
    teamMembers.forEach((teamMembersArray) => {
      if (teamMembersArray.teamId == teamId) {
        teamMembersArray.members.forEach((member) => {
          removeGroup.push(member);
        });
      }
    });

    setTempId(teamId);
    setShowRemoveModal("showRemoveModal");
  };

  const removeMember = () => {
    let hiddenDesc = "";
    let newGroup = [];

    removeGroup.forEach((member) => {
      if (member.email != memberToRemove) {
        newGroup.push(member);
        hiddenDesc += member.email;
        hiddenDesc += ",";
      }
    });

    fetch(
      "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation UpdateTeam($id : ID!, $groupData :  [Json!], $hiddenDescription : String!){

updateTeam(data: {memberData: $groupData, hiddenDesc: $hiddenDescription}, where: {id : $id}) {
    id
  }

  
}`,
          variables: {
            id: tempId,
            groupData: newGroup,
            hiddenDescription: hiddenDesc,
          },
        }),
      }
    ).then((res) => res.json());
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
              totalPositions += parseInt(openPosition.Amount);
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
                        CreateRemoveModal(team.id);
                      }}
                    >
                      Remove Member
                    </button>
                    <button
                      onClick={() => {
                        createAddModal(team.id);
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

      <div className={showRequestersClassname}>
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

      <div className={addClassname}>
        <form>
          <div>
            <label htmlFor="">Member Name</label>
            <label htmlFor="">Member Year</label>
            <label htmlFor="">Member Email</label>
            <label htmlFor="">Member Role/Degree</label>
          </div>
          <div>
            <input
              required
              type="text"
              onChange={(e) => {
                setMemberToAddInfo((memberToAddInfo) => ({
                  ...memberToAddInfo,
                  name: e.target.value,
                }));
              }}
            />
            <input
              required
              type="text"
              onChange={(e) => {
                setMemberToAddInfo((memberToAddInfo) => ({
                  ...memberToAddInfo,
                  year: e.target.value,
                }));
              }}
            />
            <input
              required
              type="text"
              onChange={(e) => {
                setMemberToAddInfo((memberToAddInfo) => ({
                  ...memberToAddInfo,
                  email: e.target.value,
                }));
              }}
            />
            <select
              onChange={(e) => {
                setMemberToAddInfo((memberToAddInfo) => ({
                  ...memberToAddInfo,
                  role: e.target.value,
                }));
              }}
            >
              <option value="other">Other</option>
              {openRoles.map((openRole) => {
                return (
                  <option value={openRole.Role}>
                    {openRole.Role} - {openRole.Years} Year
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              addMember(memberToAddInfo);
            }}
          >
            Add Member
          </button>
        </form>
      </div>

      {/* add member modal */}

      {/* remove member modal */}

      <div className={removeClassname}>
        <h2>TeamName</h2>

        <form>
          <div>
            <label htmlFor="">Member Email</label>
          </div>
          <div>
            <select
              onChange={(e) => {
                setMemberToRemove(e.target.value);
              }}
            >
              <option value="">Member Emails</option>
              {removeGroup.map((member, id) => {
                return (
                  <option key={id} value={member.email}>
                    {member.email}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              removeMember();
            }}
          >
            Remove Member
          </button>
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

      <div className={showMembersClassname}>
        {tempMembers.map((member, id) => {
          return <p key={id}>{member.name}</p>;
        })}
      </div>
    </div>

    // members
  );
};

export default ManagePage;
