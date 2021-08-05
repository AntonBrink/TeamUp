import React, { useState } from "react";
import CreateTeamStyles from "../styles/CreateTeamPage.module.css";

const CreatePage = () => {
  const [totalRoles, setTotalRoles] = useState(1);

  const [roles] = useState([
    <div className={CreateTeamStyles.roleInnerDiv} key={totalRoles}>
      <label htmlFor="" className={CreateTeamStyles.roleLabel}>
        Degree/Role
      </label>
      <input type="text" />
      <br />
      <label className={CreateTeamStyles.roleLabel} htmlFor="">
        Amount
      </label>

      <input type="number" />
      <br />
      <label className={CreateTeamStyles.roleLabel} htmlFor="">
        Year
      </label>

      <select name="" id="">
        <option value="">All</option>
        <option value="">3rd</option>
        <option value="">2nd</option>
        <option value="">1st</option>
      </select>
    </div>,
  ]);

  if (totalRoles > roles.length) {
    let newRoles = totalRoles - roles.length;

    for (let i = 0; i < newRoles; i++) {
      roles.push(
        <div className={CreateTeamStyles.roleInnerDiv} key={totalRoles}>
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Degree/Role
          </label>
          <input type="text" />
          <br />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Amount
          </label>

          <input type="number" />
          <br />
          <label className={CreateTeamStyles.roleLabel} htmlFor="">
            Year
          </label>

          <select name="" id="">
            <option value="">All</option>
            <option value="">3rd</option>
            <option value="">2nd</option>
            <option value="">1st</option>
          </select>
        </div>
      );
    }
  } else {
    let newRoles = roles.length - totalRoles;

    for (let i = 0; i < newRoles; i++) {
      roles.pop();
    }
  }

  return (
    <form action="">
      <div className={CreateTeamStyles.pageDiv}>
        <div className={CreateTeamStyles.labelDiv}>
          <label htmlFor="">Team Name</label>
          <label htmlFor="">Your Degree/Role</label>
          <label htmlFor="">Application End Date</label>
          <label htmlFor="">Total Unique Roles/Degrees</label>
        </div>
        <div className={CreateTeamStyles.inputDiv}>
          <input type="text" />
          <input type="text" />
          <input type="date" />
          <input
            type="number"
            defaultValue="1"
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
      <button className={CreateTeamStyles.createBtn}>Create Team</button>
    </form>
  );
};

export default CreatePage;
