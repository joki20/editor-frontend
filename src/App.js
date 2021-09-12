import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Toolbar from "./components/Toolbar";
import SaveBtn from "./components/SaveBtn";
import ListAll from "./components/ListAll";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Toolbar>
                    <ListAll />
                    <SaveBtn />
                </Toolbar>
                <h2>Using CKEditor 5 build in React</h2>
                <CKEditor
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log("Editor is ready to use!", editor);
                    }}
                />
            </div>
        );
    }
}

export default App;
