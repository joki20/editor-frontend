import React from "react";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Toolbar = (props) => {
    return (
        <div className="Toolbar">
            <div className="user">
                <div>{props.currentUser} is logged in</div>
                <button onClick={props.logout} >Log out</button>
            </div>
            <div className="clickedStatus">{props.messageStatus}</div>
        </div>
    )
};

export default Toolbar;
