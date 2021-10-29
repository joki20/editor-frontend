import React from "react";

// Execute code button
const ExecuteCodeBtn = (props) => {
    return <button className="ExecuteCodeBtn hidden" onClick={props.executeCode} >Execute code</button>;
};

export default ExecuteCodeBtn;
