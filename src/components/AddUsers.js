import React from 'react';


// CURRENT STATE
const AddUsers = (props) => {
  let id = 0;
  return (
    <div className="AddUsers">
    <h2>Add user</h2>
      <ul>
      {props.unallowedUsers.map((user) => (
          <li onClick={props.allowUser}
        key={++id}
      >{user}</li>
      ))
      }
      </ul>
    </div>
  )
}

export default AddUsers;