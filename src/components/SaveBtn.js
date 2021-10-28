import React from "react";

// Save button
const SaveBtn = (props) => {
    return <button className="SaveBtn hidden" onClick={props.saveContent} >SAVE DOC</button>;
};

export default SaveBtn;