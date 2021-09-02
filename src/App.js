import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// SAVE FUNCTION
function save() {
  let content = document.querySelector(".ck p").textContent
  console.log(content)

}

// TOOLBAR WITH SAVE BUTTON
function Toolbar() {
  return (
    <div className="toolbar">
      <SaveBtn />
    </div>
  )
}

// SAVE BUTTON
class SaveBtn extends Component {
  render() {
    return (
      <button className="btn save" onClick={save} >Save</button>
    )
  }
}


class App extends Component {
    render() {
        return (
          <div className="App">
            <Toolbar />
                <h2>Using CKEditor 5 build in React</h2>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                />
            </div>
        );
    }
}

export default App;