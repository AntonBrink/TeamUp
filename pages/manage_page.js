import React from "react";
import * as manageStyles from "../styles/ManagePage.module.css";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../stores/authContext";
import Image from "next/image";

const ManagePage = () => {
  const { user, authReady } = useContext(AuthContext);
  const [teams, setTeams] = useState();
  const [teamsReady, setTeamsReady] = useState(false);
  const [tempMembers, setTempMembers] = useState([]);
  const [tempRequests, setTempRequests] = useState([]);
  const [memberToRemove, setMemberToRemove] = useState("");
  const [removeGroup, setRemoveGroup] = useState([]);
  const [tempId, setTempId] = useState("");
  const [tempId2, setTempId2] = useState("");
  const [openRoles, setOpenRoles] = useState([]);

  let teamMembers = [];
  let joinRequests = [];
  const [displayRemoveModal, setShowRemoveModal] =
    useState("noShowRemoveModal");
  const [displayMembers, setDisplayMembers] = useState("noshowmembers");
  const [displayRequesters, setDisplayRequesters] =
    useState("noshowrequesters");

  const [showBlur, setShowBlur] = useState("noShowBlur");
  const mainPageBlur =
    showBlur == "noShowBlur"
      ? `${manageStyles.noMainPageBlur}`
      : `${manageStyles.mainPageBlur}`;

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

  useEffect(() => {
    if (tempId2 !== "") {
      fetchRoles().then((response) => {
        console.log(response);
        setOpenRoles(response.data.teams[0].openPositions);
      });
    }
  }, [tempId2]);

  // useEffect(() => {
  //   if (openRoles.length !== 0) {
  //     setDisplayShowAddModal("showAddModal");
  //     console.log(openRoles);
  //   }
  // }, [openRoles]);

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

  const declineRequest = (memberEmail) => {
    let newRequests = [];

    tempRequests.map((requester) => {
      if (requester.email != memberEmail) {
        newRequests.push(requester);
      }
    });

    fetch(
      "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation UpdateTeam($id : ID!, $memberApplications :  [Json!]){
    updateTeam(data: {memberApplications: $memberApplications}, where: {id : $id}) {
        id
      }

    }`,
          variables: {
            id: tempId2,
            memberApplications: newRequests,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res !== undefined) {
          location.reload();
        }
      });
  };

  const fetchRoles = async () => {
    console.log(tempId2);

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
            tempId: tempId2,
          },
        }),
      }
    );

    const openPositions = await response.json();
    return openPositions;
  };

  const addMember = (memberInfo) => {
    let newRoles = [];

    if (memberInfo.role == "" || memberInfo.role == "other") {
      memberInfo.role = "other";
    } else {
      openRoles.map((role) => {
        console.log(role);
        console.log(memberInfo.role);
        console.log(memberInfo.year);

        if (role.Role == memberInfo.role) {
          if (role.Years == memberInfo.year) {
            if (role.Amount > 1) {
              let tempAmount = parseInt(role.Amount) - 1;

              role.Amount = tempAmount.toString();
            } else if (role.Years == "All") {
              let tempAmount = parseInt(role.Amount) - 1;
              role.Amount = tempAmount.toString();
            } else {
              return;
            }
          }
        }

        newRoles.push(role);
      });
    }

    let hiddenDesc = "";
    let newGroup = [];
    let myInfo = [];

    fetch(
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
            tempId: tempId2,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("check 2");

        let memberData = res;

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
                id: tempId2,
                groupData: newGroup,
                hiddenDescription: hiddenDesc,
                openRoles: newRoles,
              },
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res !== undefined) {
              declineRequest(memberInfo.email);
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CreateRemoveModal = (teamId) => {
    setRemoveGroup([]);

    teamMembers.forEach((teamMembersArray) => {
      if (teamMembersArray.teamId == teamId) {
        teamMembersArray.members.forEach((member) => {
          setRemoveGroup((removeGroup) => [...removeGroup, member]);
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

    setTempMembers([]);

    teamMembers.forEach((teamMembersArray) => {
      if (teamMembersArray.teamId == teamId) {
        teamMembersArray.members.forEach((member) => {
          setTempMembers((tempMembers) => [...tempMembers, member]);
        });
      }
    });
  };

  const memberApplicationsFunction = (teamId) => {
    setTempId2(teamId);
    setDisplayRequesters("showrequesters");

    setTempRequests([]);

    joinRequests.forEach((memberApplicationsArray) => {
      if (memberApplicationsArray.teamId == teamId) {
        memberApplicationsArray.members.forEach((member) => {
          setTempRequests((tempRequests) => [...tempRequests, member]);
        });
      }
    });
  };

  return (
    <div className={manageStyles.pageDiv}>
      <div className={manageStyles.leftPageDiv}>
        <h1 className={manageStyles.heading}>Your Teams:</h1>

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
                <div className={manageStyles.teamDiv} key={team.id}>
                  <h2>{team.teamName}</h2>
                  <p>
                    {team.memberData.length}/{totalPositions} members
                  </p>
                  <ul>
                    Member(s) needed:{" "}
                    {team.openPositions.map((openPosition, id) => {
                      return (
                        <li key={id}>
                          {openPosition.Amount} {openPosition.Role}(s){" "}
                          {openPosition.Years}
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
                          setShowBlur("showBlur");
                        }}
                      >
                        Remove Member
                      </button>
                      <button
                        onClick={() => {
                          showFunction(team.id);
                          setShowBlur("showBlur");
                        }}
                      >
                        View Members
                      </button>
                      <button
                        onClick={() => {
                          memberApplicationsFunction(team.id);
                          setShowBlur("showBlur");
                        }}
                      >
                        View Join Requests
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => {
                          showFunction(team.id);
                          setShowBlur("showBlur");
                        }}
                      >
                        View Members
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Join Requests */}

        <div className={showRequestersClassname}>
          <button
            className={manageStyles.closeButton}
            onClick={() => {
              setDisplayRequesters("noshowrequesters");
              setShowBlur("noShowBlur");
            }}
          >
            X
          </button>
          {tempRequests.map((requester, id) => {
            let requesterDetails = {
              email: requester.email,
              name: requester.name,
              role: "",
              year: "other",
            };

            if (requester.role) {
              requesterDetails.role = requester.role;
            }

            if (requester.year) {
              requesterDetails.year = requester.year;
            }

            return (
              <div key={id}>
                <h2> Requests To Join Team:</h2>
                <p key={id}>
                  Applicant Information: {requester.name} | {requester.email} |{" "}
                  {requester.userYear} | Role Information: {requester.role} |{" "}
                  {requester.year}
                  <button
                    onClick={() => {
                      addMember(requesterDetails);
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      declineRequest(requester.email);
                    }}
                  >
                    Decline
                  </button>
                </p>
              </div>
            );
          })}
        </div>

        {/* Join Requests */}

        {/* remove member modal */}
        <div
          className={mainPageBlur}
          onClick={() => {
            setShowRemoveModal("noShowRemoveModal");
            setShowBlur("noShowBlur");
            setDisplayMembers("noshowmembers");
            setDisplayRequesters("noshowrequesters");
          }}
        ></div>

        <div className={removeClassname}>
          <button
            className={manageStyles.closeButton}
            onClick={() => {
              setShowRemoveModal("noShowRemoveModal");
              setShowBlur("noShowBlur");
            }}
          >
            X
          </button>
          <h2>TeamName</h2>

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
                if (member.email !== user.email) {
                  return (
                    <option key={id} value={member.email}>
                      {member.email}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <button
            className={manageStyles.removeButton}
            onClick={() => {
              removeMember();
            }}
          >
            Remove Member
          </button>

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
          <button
            className={manageStyles.closeButton}
            onClick={() => {
              setDisplayMembers("noshowmembers");
              setShowBlur("noShowBlur");
            }}
          >
            X
          </button>
          <h2>Team Members:</h2>
          {tempMembers.map((member, id) => {
            return <p key={id}>{member.name}</p>;
          })}
        </div>
      </div>
      <div className={manageStyles.rightPageDiv}>
        <Image
          src="/groupvideo.png"
          alt="Could not find logo"
          className={manageStyles.image}
          layout="responsive"
          width="100px"
          height="100px"
        />
      </div>
    </div>

    // members
  );
};

export default ManagePage;
