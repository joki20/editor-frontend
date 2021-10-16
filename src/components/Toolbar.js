import React from "react";
import AuthForm from "./AuthForm.js";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Toolbar = (props) => {
    return (
        <div className="Toolbar">
            <AuthForm
                // from App.js
                handleRegister={props.handleRegister}
                handleLogin={props.handleLogin}
                token={props.token}
                currentUser={props.currentUser}
                logout={props.logout}
            />

            <button onClick={props.saveContent} >SAVE DOC</button>
            <div className="clickedStatus">{props.messageStatus}</div>
        </div>
    )
};

export default Toolbar;
