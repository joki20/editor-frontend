import React from "react";

// LIST OF DOCUMENTS
const ListAll = () => {
    let jsonData = [
        { id: "1", name: "Susita", title: "X5" },
        { id: "2", name: "BMW", title: "Alpha" },
        { id: "3", name: "Volvo", title: "850" },
    ];

    return (
        <form>
            <select>
                <option selected disabled="true">
                    --- Create or edit document ---
                </option>
                <option>Create new</option>
                {jsonData.map((item) => (
                    <option text={item.id}>{item.name}</option>
                ))}
            </select>
        </form>
    );
};

export default ListAll;
