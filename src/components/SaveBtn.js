import React from "react";

// SAVE BUTTON
const SaveBtn = () => {
    const clicked = () => {
        // console.log content
        let content = document.querySelector(".ck p").textContent;
        console.log(content);
    };
    return (
        <button onClick={clicked} className="btn save">
            Save
        </button>
    );
};

export default SaveBtn;
