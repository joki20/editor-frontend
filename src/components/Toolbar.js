import React from "react";

// TOOLBAR WITH SAVE BUTTON props.children inside
const Toolbar = (props) => {
    return <div className="toolbar">{props.children}</div>;
};

export default Toolbar;
