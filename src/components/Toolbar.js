import React from "react";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Toolbar = (props) => {
    return (
        <div className="Toolbar">
            <button onClick={props.saveContent} >SAVE</button>
            <div className="clickedStatus">{props.messageStatus}</div>
        </div>
    )
};

export default Toolbar;
