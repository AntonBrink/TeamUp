import React, { useState, useContext } from "react";
import CreateTeamStyles from "../styles/CreateTeamPage.module.css";
import AuthContext from "../stores/authContext";
import Image from "next/image";

const CreatePage = () => {
  const { user, authReady } = useContext(AuthContext);
  const [totalRoles, setTotalRoles] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [creatorRole, setCreatorRole] = useState("");
  const [creatorYear, setCreatorYear] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [groupType, setGroupType] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const groupData = [];

  const [openRoles, setOpenRoles] = useState([]);
  const [years, setYears] = useState([]);
  const [amount, setAmount] = useState([]);

  const [displayConfirmation, setDisplayConfirmation] =
    useState("noShowConfirmation");

  const [showBlur, setShowBlur] = useState("noShowBlur");
  const mainPageBlur =
    showBlur == "noShowBlur"
      ? `${CreateTeamStyles.noMainPageBlur}`
      : `${CreateTeamStyles.mainPageBlur}`;

  const showConfirmation =
    displayConfirmation == "noShowConfirmation"
      ? `${CreateTeamStyles.noShowConfirmation}`
      : `${CreateTeamStyles.showConfirmation}`;

  const [roles] = useState([
    <div className={CreateTeamStyles.roleInnerDiv} key={totalRoles}>
      <label htmlFor="" className={CreateTeamStyles.roleLabel}>
        Member Degree / Role :
      </label>
      <input
        placeholder="e.g. BA"
        type="text"
        name="memberDegree0"
        required
        onChange={(e) => {
          setOpenRoles((openRoles) => ({ ...openRoles, [0]: e.target.value }));
        }}
        className={CreateTeamStyles.roleLabel}
      />
      <label className={CreateTeamStyles.roleLabel} htmlFor="" required>
        Amount :
      </label>

      <input
        placeholder="e.g. 2"
        type="number"
        name="memberDegreeAmount0"
        required
        min="1"
        onChange={(e) => {
          setAmount((amount) => ({ ...amount, [0]: e.target.value }));
        }}
      />
      <label className={CreateTeamStyles.roleLabel} htmlFor="">
        Member Year :
      </label>

      <select
        className={CreateTeamStyles.select}
        name="memberDegreeYear0"
        onChange={(e) => {
          setYears((years) => ({ ...years, [0]: e.target.value }));
        }}
      >
        <option value="All">All</option>
        <option value="3">3rd</option>
        <option value="2">2nd</option>
        <option value="1">1st</option>
      </select>
      <br />
    </div>,
  ]);

  const createTeam = (e) => {
    console.log(years);

    const memberData = [
      {
        role: creatorRole,
        year: creatorYear,
        name: user.user_metadata.full_name,
        email: user.email,
      },
    ];

    for (let i = 0; i < totalRoles; i++) {
      if (years[i] == undefined) {
        years[i] = "All";
      }

      groupData.push({
        Role: openRoles[i],
        Amount: amount[i],
        Years: years[i],
      });
    }

    console.log(groupData);

    e.preventDefault();

    if (authReady && user) {
      fetch(
        "https://api-eu-central-1.graphcms.com/v2/ckryvxf6e25y801xtfsosabhf/master",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `mutation MyMutation($myTeamName : String!, $creatorName : String!, $endDate : Date!, $creatorEmail : String!, $openPositions: [Json!], $memberData: [Json!], $groupDescription: String!, $groupType : String!, $hiddenDesc: String!) {

  createTeam(data: {teamName: $myTeamName, creatorName: $creatorName, creatorEmail : $creatorEmail, applyEndDate: $endDate , openPositions: $openPositions, memberData : $memberData, groupDescription : $groupDescription, groupType : $groupType, hiddenDesc : $hiddenDesc}){
    id
    
  }
}
`,
            variables: {
              myTeamName: teamName,
              creatorName: user.user_metadata.full_name,
              endDate: endDate,
              creatorEmail: user.email,
              openPositions: groupData,
              memberData: memberData,
              groupDescription: groupDescription,
              groupType: groupType,
              hiddenDesc: user.email,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res != "undefined") {
            setDisplayConfirmation("showConfirmation");
            setShowBlur("showBlur");
          }
        });
      console.log("Fetched");
    }
  };

  if (totalRoles > roles.length) {
    let newRoles = totalRoles - roles.length;

    for (let i = 0; i < newRoles; i++) {
      let divId = roles.length;

      roles.push(
        <div className={CreateTeamStyles.roleInnerDiv} key={totalRoles}>
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Member Degree / Role :
          </label>
          <input
            placeholder="e.g. BA"
            type="text"
            name={`memberDegree${divId}`}
            required
            onChange={(e) => {
              setOpenRoles((openRoles) => ({
                ...openRoles,
                [divId]: e.target.value,
              }));
            }}
          />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Amount :
          </label>

          <input
            placeholder="e.g. 2"
            type="number"
            name={`memberDegreeAmount${divId}`}
            required
            min="1"
            onChange={(e) => {
              setAmount((amount) => ({
                ...amount,
                [divId]: e.target.value,
              }));
            }}
          />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Member Year :
          </label>

          <select
            className={CreateTeamStyles.select}
            name={`memberDegreeYear${divId}`}
            id=""
            required
            onChange={(e) => {
              setYears((years) => ({
                ...years,
                [divId]: e.target.value,
              }));
            }}
          >
            <option value="All">All</option>
            <option value="3">3rd</option>
            <option value="2">2nd</option>
            <option value="1">1st</option>
          </select>
          <br />
        </div>
      );
      console.log("divId", divId);
      console.log("roles", roles.length);
      console.log("i", i);
    }
  } else {
    let newRoles = roles.length - totalRoles;

    for (let i = 0; i < newRoles; i++) {
      roles.pop();
    }
  }

  return (
    <div className={CreateTeamStyles.mainDiv}>
      <div
        className={mainPageBlur}
        onClick={() => {
          setDisplayConfirmation("noShowConfirmation");
          setShowBlur("noShowBlur");
        }}
      ></div>
      <div className={showConfirmation}>
        <button
          className={CreateTeamStyles.closeButton}
          onClick={() => {
            setDisplayConfirmation("noShowConfirmation");
            setShowBlur("noShowBlur");
          }}
        >
          X
        </button>
        <h2> You successfully created a team!</h2>
      </div>
      {!user && <div>You must be logged in to create a team</div>}

      {user && (
        <form
          onSubmit={(e) => {
            createTeam(e);
          }}
        >
          <div className={CreateTeamStyles.page}>
            <div className={CreateTeamStyles.holderDiv}>
              <div className={CreateTeamStyles.pageDivLeft}>
                <h1 className={CreateTeamStyles.headers}>
                  New Team Information :
                </h1>

                <div className={CreateTeamStyles.pageDiv}>
                  <div className={CreateTeamStyles.labelDiv}>
                    <label htmlFor="">Team Name :</label>
                    <label htmlFor="" className={CreateTeamStyles.typeLabel}>
                      Team Type :
                    </label>
                    <label
                      htmlFor=""
                      className={CreateTeamStyles.descriptionLabel}
                    >
                      Team Description :
                    </label>
                    <label htmlFor="">Your Degree/Role :</label>
                    <label htmlFor="">Your Year :</label>
                    <label htmlFor="">Application End Date :</label>
                    <label htmlFor="">Total Unique Roles/Degrees :</label>
                  </div>
                  <div className={CreateTeamStyles.inputDiv}>
                    <input
                      placeholder="e.g. TeamUp"
                      type="text"
                      name="teamName"
                      required
                      onChange={(e) => {
                        setTeamName(e.target.value);
                      }}
                    />
                    <textarea
                      className={CreateTeamStyles.teamType}
                      placeholder="e.g. Competition, Assignment, Recreation"
                      type="text"
                      name="groupType"
                      required
                      onChange={(e) => {
                        setGroupType(e.target.value);
                      }}
                    />
                    <textarea
                      placeholder="e.g. We are a group of students who want to pariticipate in the EdTeck Hack Jam"
                      type="text"
                      name="groupDescription"
                      required
                      onChange={(e) => {
                        setGroupDescription(e.target.value);
                      }}
                    />
                    <input
                      placeholder="BSC IT"
                      type="text"
                      name="creatorDegreeRole"
                      required
                      onChange={(e) => {
                        setCreatorRole(e.target.value);
                      }}
                    />
                    <input
                      placeholder="e.g. 3"
                      type="number"
                      name="creatorYear"
                      required
                      onChange={(e) => {
                        setCreatorYear(e.target.value);
                      }}
                    />
                    <input
                      type="date"
                      name="endDate"
                      required
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                    />

                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="1"
                      name="uniqueRoles"
                      required
                      onChange={(e) => {
                        setTotalRoles(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <h1 className={CreateTeamStyles.headers}>Team Members:</h1>
                <div className={CreateTeamStyles.teamMembersDiv}>
                  {roles.map((role, id) => {
                    return (
                      <div className={CreateTeamStyles.roleDiv} key={id}>
                        {role}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={CreateTeamStyles.btnDiv}>
                <button type="submit" className={CreateTeamStyles.createBtn}>
                  Create Team
                </button>
              </div>
            </div>
            <div className={CreateTeamStyles.pageDivRight}>
              <Image
                src="/puzzle.png"
                alt="Could not find logo"
                layout="responsive"
                width="250px"
                height="200px"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePage;
