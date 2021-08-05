import react from "React";
import * as manageStyles from "../styles/ManagePage.module.css";

const ManagePage = () => {
  return (
    <div>
      <h1>Your Teams</h1>
      <div>
        <div>
          <h2>TeamName</h2>
          <p>2/5 members</p>
          <p>Member(s) needed</p>
        </div>

        <div>
          <button>Disband</button>
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
