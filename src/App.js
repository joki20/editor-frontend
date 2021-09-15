import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Toolbar from "./components/Toolbar";
import ListAll from "./components/ListAll";
import axios from 'axios'; // database requests

// global variables
let ck5editor;
let selectIndex = 1; // start choice (create new)
let chosen; // chosen <option> element, undefined if empty
let id;
let title;
let text;

function setEditor(editor) {
    ck5editor = editor;
    return ck5editor
}

function renderSelect(e) {
    // get index of <select>
    selectIndex = e.target.options.selectedIndex;

    // get chosen <select> and extract id, title and text
    chosen = document.getElementsByTagName("option")[selectIndex];
    id = chosen.getAttribute("name");
    title = chosen.innerText;
    text = chosen.getAttribute("text")
  
    console.log("FÖRE TEXT")
    console.log(text);
    console.log("EFTER TEXT");

    // Replace text content in ck5 to changed
    ck5editor.setData(text);

    // empty status div
    document.getElementsByClassName("status")[0].innerHTML = "";
}

async function createOrSave(e) {
    e.preventDefault();

    // get text with <p> tags
    text = ck5editor.getData()

    // if CREATE NEW was selected
    if (selectIndex === 1) {
        console.log("NEW DOCUMENT CREATED");
        
        // create title from text
        title = text.substring(3, 15);
        
        // post as query /create?title=titel&content=text
        await axios.post(`https://jsramverk-editor-joki20.azurewebsites.net/create`, {
            title: title,
            content: text
        })
            .then(response => response.status)
            .catch(err => console.warn(err));

        console.log("NEW DOCUMENT CREATED")
    
    } else { // else UPDATE DOCUMENT

        // replace <option text> to current/changed content
        chosen.setAttribute("text", text);

        await axios.post(`https://jsramverk-editor-joki20.azurewebsites.net/update/${id}/`, {
            title: title,
            content: text
        })
            .then(response => response.status)
            .catch(err => console.warn(err));
    }
    window.location.reload();

    console.log("DOCUMENT UPDATED")
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <Toolbar>
                    <ListAll
                        editorComponent={ck5editor}
                        renderContentAfterChoice={renderSelect}
                        createOrSaveDocument={createOrSave}
                    />
                </Toolbar>
                <h2>Using CKEditor 5 build in React</h2>
                <CKEditor
                    editor={ClassicEditor}
                    id="ckeditor"
                    data="<p>Make a choice in the menu!</p>" 
                    onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log("Editor is ready to use!", editor);
                        setEditor(editor);
                    }}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        // console.log( { data } );
                    } }

                />
            </div>
        );
    }
}

export default App;
