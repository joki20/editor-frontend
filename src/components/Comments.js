import React from 'react';


// IF COMMENT (<p title=) EXISTS, ADD LI, OTHERWISE DON'T
const Comments = (props) => {
  return (
    <div className="Comments">
      <h2>Comments</h2>
      <textarea className="hidden"></textarea>
      <button className="CommentsBtn hidden" onClick={props.saveComment}>Save comment</button>
    </div>
  )
}

  export default Comments;