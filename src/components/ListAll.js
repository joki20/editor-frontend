import React from 'react';
import axios from 'axios';

let chosen; // chosen element, undefined if no choice was made
let id; // id of newly chosen select
let title; // title of newly chosen select
let text; // text of newly chosen select. Changes if save button is pressed
let currentUpdateAddress; // update API address for chosen text
let selectIndex = "not set"; // undefined if no choice is made, 1 if Create New is chosen

// RENDER CHOSEN DOCUMENT INSIDE CKEDITOR
const renderChoice = function (e) {
    selectIndex = e.target.options.selectedIndex;

    // set chosen
    chosen = document.getElementsByTagName("option")[selectIndex];
    id = chosen.getAttribute("name");
    title = chosen.innerText;
    text = chosen.getAttribute("text");

    // empty status div
    document.getElementsByClassName("status")[0].innerHTML = "";

    // Replace text content in CKEDITOR
    document.querySelector(".ck p").innerHTML = text;
}

// SAVE DOCUMENT IN MONGODB
const createOrSaveDocument = (e) => {
    // prevent reloading of page
    e.preventDefault();

    // set 'text' to current content
    text = document.querySelector(".ck p").innerHTML;

    // if CREATE NEW was selected (null meaning variable is undefined/not set), make post request to create new
    if (selectIndex == "not set" || selectIndex === 1) {

        console.log("NEW DOCUMENT CREATED");
        // set title to part of text
        title = text.slice(0, 10);

        // encoded POST address
        currentUpdateAddress = encodeURI(`https://jsramverk-editor-joki20.azurewebsites.net/create/${title}/${text}`);

        // set content in mongoDB to current/changed content
        axios.post(currentUpdateAddress);

        document.getElementsByClassName("status")[0].innerHTML = "New document was created!";

    } else { // else UPDATE DOCUMENT
        console.log("DOCUMENT UPDATED")

        // replace <option text> to current/changed content
        chosen.setAttribute("text", text);

        // set encoded POST address
        currentUpdateAddress = encodeURI(`https://jsramverk-editor-joki20.azurewebsites.net/update/${id}/${title}/${text}`);

        // set content in mongoDB to current/changed content
        axios.post(currentUpdateAddress);

        document.getElementsByClassName("status")[0].innerHTML = "Document was updated!";
    }
}


class ListAll extends React.Component {
  state = {
    documents: []
  }

  componentDidMount() {
    axios.get(`https://jsramverk-editor-joki20.azurewebsites.net/list`)
      .then(res => {
        const documents = res.data.data; // res.data.data is array of objects/documents
        this.setState({ documents });
      })
  }

  render() {
      return (
        <div>
            <form className="documentChoices">
                <select onChange={renderChoice}>
                    <option defaultValue disabled={true}>
                        --- Create or edit document ---
                    </option>
                    <option>Create new</option>
                    <option disabled={true}></option>

                    {this.state.documents.map((doc) => (
                        <option key={doc._id} name={doc._id} text={doc.content}>{doc.title}</option>
                    ))}
                </select>
                <input type="submit" onClick={createOrSaveDocument} className="btn save"></input>
            </form>
            <div className="status"></div>
        </div>

    )
  }
}

export default ListAll;


<form action="blah.php" method="post">
  <input type="text" name="data" value="mydata" />
  <input type="submit" />
</form>