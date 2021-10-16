import React from 'react';


// CURRENT STATE
const ListDocs = (props) => {
  return (
    <div className="ListDocs">
      <h2>Documents</h2>
      <ul>
        {props.listDocs.map((doc) => (
          <li onClick={props.clickTitle}
        key={doc.id}
        name={doc.id}
      >{doc.title}</li>
      ))
      }
      </ul>
    </div>
  )
}

  export default ListDocs;