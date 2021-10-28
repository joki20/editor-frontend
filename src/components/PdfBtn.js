import React from "react";

// Switch button
const PdfBtn = (props) => {
    return <button className="PdfBtn" onClick={props.savePDF} >Create PDF</button>;
};

export default PdfBtn;