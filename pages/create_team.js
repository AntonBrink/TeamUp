import React, { useState, useContext } from "react";
import CreateTeamStyles from "../styles/CreateTeamPage.module.css";
import AuthContext from "../stores/authContext";

const CreatePage = () => {
  const { user, authReady } = useContext(AuthContext);
  const [totalRoles, setTotalRoles] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [creatorRole, setCreatorRole] = useState("");
  const [creatorYear, setCreatorYear] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [groupType, setGroupType] = useState("");
  const groupData = [];

  const [openRoles, setOpenRoles] = useState([]);
  const [years, setYears] = useState([]);
  const [amount, setAmount] = useState([]);

  const [roles] = useState([
    <div className={CreateTeamStyles.roleInnerDiv} key={totalRoles}>
      <label htmlFor="" className={CreateTeamStyles.roleLabel}>
        Degree/Role
      </label>
      <input
        type="text"
        name="memberDegree0"
        required
        onChange={(e) => {
          setOpenRoles((openRoles) => ({ ...openRoles, [0]: e.target.value }));
        }}
      />
      <br />
      <label className={CreateTeamStyles.roleLabel} htmlFor="" required>
        Amount
      </label>

      <input
        type="number"
        name="memberDegreeAmount0"
        required
        min="1"
        onChange={(e) => {
          setAmount((amount) => ({ ...amount, [0]: e.target.value }));
        }}
      />
      <br />
      <label className={CreateTeamStyles.roleLabel} htmlFor="">
        Year
      </label>

      <select
        id=""
        name="memberDegreeYear0"
        onChange={(e) => {
          setYears((years) => ({ ...years, [0]: e.target.value }));
        }}
      >
        <option value="All">All</option>
        <option value="3rd">3rd</option>
        <option value="2nd">2nd</option>
        <option value="1st">1st</option>
      </select>
    </div>,
  ]);

  const createTeam = (e) => {
    console.log(years);

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
            query: `mutation MyMutation($myTeamName : String!, $creatorName : String!, $endDate : Date!, $creatorEmail : String!, $openPositions: [Json!]) {

  createTeam(data: {teamName: $myTeamName, creatorName: $creatorName, creatorEmail : $creatorEmail, applyEndDate: $endDate , openPositions: $openPositions}){
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
            },
          }),
        }
      );
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
            Degree/Role
          </label>
          <input
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
          <br />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Amount
          </label>

          <input
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
          <br />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Year
          </label>

          <select
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
            <option value="3rd">3rd</option>
            <option value="2nd">2nd</option>
            <option value="1st">1st</option>
          </select>
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
    <div>
      {!user && <div>You must be logged in to create a team</div>}

      {user && (
        <form
          onSubmit={(e) => {
            createTeam(e);
          }}
        >
          <div className={CreateTeamStyles.pageDiv}>
            <div className={CreateTeamStyles.labelDiv}>
              <label htmlFor="">Team Name</label>
              <label htmlFor="">Your Degree/Role</label>
              <label htmlFor="">Your Year</label>
              <label htmlFor="">Application End Date</label>
              <label htmlFor="">Total Unique Roles/Degrees</label>
            </div>
            <div className={CreateTeamStyles.inputDiv}>
              <input
                type="text"
                name="teamName"
                required
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
              <input
                type="text"
                name="creatorDegreeRole"
                required
                onChange={(e) => {
                  setCreatorRole(e.target.value);
                }}
              />
              <input
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
          <div>
            {roles.map((role, id) => {
              return (
                <div className={CreateTeamStyles.roleDiv} key={id}>
                  {role}
                </div>
              );
            })}
          </div>
          <button type="submit" className={CreateTeamStyles.createBtn}>
            Create Team
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePage;
