import React from 'react';


// CURRENT STATE
const ListAll = (props) => {
  console.log(props)
  return (
    <div>
      <ul className="ListAll">
        {props.listDocs.map((doc) => (
          <li onClick={props.clickTitle}
        key={doc._id}
        name={doc._id}
      >{doc.title}</li>
      ))
      }
      </ul>
    </div>
  )
}

  export default ListAll;