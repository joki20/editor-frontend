import React from "react";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Title = (props) => {
    return (
        <div className="Title">
            <input className="titleInput" aria-label="inputLable" value={props.currentTitle}></input>
        </div>

    )
};

export default Title;