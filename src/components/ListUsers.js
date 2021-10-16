import React from 'react';

// CURRENT STATE
const ListUsers = (props) => {
  let id = 0;
  return (
    <div className="ListUsers">
      <h2>Allowed users</h2>
      <ul>
        {props.allowedUsers.map((user) => (
          <li 
        key={++id}
      >{user}</li>
      ))
      }
      </ul>
    </div>
  )
}

export default ListUsers;