import React from "react";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Title = (props) => {
    return (
        <div className="Title">
            <h2>Title</h2>
            <input className="titleInput" aria-label="inputLable"></input>
        </div>

    )
};

export default Title;