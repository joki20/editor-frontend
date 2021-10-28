import React from 'react';


// CURRENT STATE
const InviteUsers = (props) => {
  let id = 0;
  return (
    <div className="InviteUsers">
          <h2>Invite user</h2>
          <input className="inputInvitation hidden"></input>
      <button className="InviteBtn hidden" onClick={props.sendMail} >✉️</button>
    </div>
  )
}

export default InviteUsers;