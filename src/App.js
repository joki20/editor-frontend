import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LandingPage from "./components/LandingPage";
import Toolbar from "./components/Toolbar";
import SaveBtn from "./components/SaveBtn";
import ListDocs from "./components/ListDocs.js";
import ListUsers from "./components/ListUsers.js";
import AddUsers from "./components/AddUsers.js";
import InviteUsers from "./components/InviteUsers.js";
import Title from "./components/Title.js";
import axios from 'axios'; // database requests
import './App.css';
import 'react-quill/dist/quill.bubble.css';
// io is a function to call an individual socket
import io from "socket.io-client";
// KRAV 1: SKAPA PDF
import PdfBtn from "./components/PdfBtn.js";
import html2pdf from 'html2pdf.js';
// KRAV 2: KOD-KOMMENTARER
import Comments from "./components/Comments.js";
// KRAV 3: MAILINBJUDAN
// se backend
// KRAV 4: CODE MODE
import 'codemirror/lib/codemirror.css'; // styles available for text editor
import 'codemirror/theme/material.css'; // theme
import 'codemirror/mode/javascript/javascript'; // xml/xml and css/css also available
import { Controlled as CodeMirror } from 'react-codemirror2';
import SwitchEditorBtn from "./components/SwitchEditorBtn.js";
import ExecuteCodeBtn from "./components/ExecuteCodeBtn.js";

// let server = `http://localhost:1337`;
let server = `https://jsramverk-editor-joki20.azurewebsites.net`
const socket = io(server); // http://localhost:3000

var htmlRowsArray;
var htmlCollection;
var rowIndex;
var rowText;

window.addEventListener("keydown", function (e) {
    if (e.keyCode === 13 && !document.getElementsByClassName("Comments")[0].classList.contains("hidden")) {
        htmlCollection = [...document.getElementsByClassName("ql-editor")[0].children];

        // remove highlighting and comment section
        for (let [i, row] of htmlCollection.entries()) {
            console.log(i);
            row.removeAttribute("style");
        }
        document.querySelector(".Comments > textarea").classList.add("hidden")
        document.querySelector(".Comments > button").classList.add("hidden")
    }
});

window.addEventListener("click", function (e) {
    let parentElement = e.target.parentElement;

    // if <p> row inside ql-editor was clicked
    if (parentElement.classList.contains("ql-editor") && e.target.localName === "p") {
        rowIndex = [...e.target.parentElement.children].indexOf(e.target);
        htmlCollection = [...e.target.parentElement.children] // html collection

        document.querySelector(".Comments > textarea").classList.remove("hidden")
        document.querySelector(".Comments > button").classList.remove("hidden")
        
        // LIST COMMENTS IN THIS DOC
        // convert each <p></p> to html and return to array of rows
        // var parser = new DOMParser();
        // var doc = parser.parseFromString(doc.content, 'text/html');
        // var htmlCollection = doc.body.children;
        // toRowsArray = [].slice.call(htmlCollection);

        

        // when clicking a row, remove styling for all rows, then set highlight style for clicked row
        for (let [i, row] of htmlCollection.entries()) {
            console.log(i);
            row.removeAttribute("style");
        }
        e.target.setAttribute("style", "background-color:lightyellow");

        // set textarea value to 'title' attribute of clicked <p>
        let rowComment = htmlCollection[rowIndex].getAttribute('title');

        let commentsTextarea = document.querySelector(".Comments > textarea");

        commentsTextarea.value = rowComment;
    } else if (
        !parentElement.classList.contains("Comments")
    ) {
        
        // hide button and remove highlighting
        document.querySelector(".Comments > textarea").classList.add("hidden")
        document.querySelector(".Comments > button").classList.add("hidden")
        htmlCollection = [...document.getElementsByClassName("ql-editor")[0].children]
        for (let [i, row] of htmlCollection.entries()) {
            console.log(i);
            row.removeAttribute("style");
        }
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        // CURRENT STATE
        this.state = {
            landingPageMessage: '',
            allUsers: [],
            allowedDocs: [],
            allowedUsers: [], // array with objects
            unallowedUsers: [],
            currentTitle: '',
            currentContent: '',
            messageStatus: '',
            token: "", // if token is set, user is logged in
            currentUser: "",
            clickedDocId: "",
            clickedDocOwner: "",
            currentCode: "",
            type: "document",    // either "document" or "code"
            rowIndex: rowIndex,
            rowText: rowText,
            htmlRowsArray: [],
            commentsArray: [],
        };
    }

    socketUpdateContent(content) {
        this.setState({ currentContent: content })
    }

    getDocs = async () => {
        let usersArray = [];
        let allUsers = [];
        let allowedDocs = [];

        await axios({
            url: `${server}/graphql/`,
            method: 'post', // use post to get data
            data: {
                // if any key is not available in UsersType, error ERR_NAME_NOT_RESOLVED 
                // query the following keys allowed in UsersType
                query: `
                {
                    users {
                        email
                        docs {
                            id
                            title
                            content
                            type
                            allowed_users {
                                email
                            }
                        }
                    }
                }
                `
            }
        }).then((res) => {
            usersArray = res.data.data.users; // array with { email:    and    docs: } 
            
            // for each user...
            usersArray.forEach((user) => {
                // collect every created user in database
                allUsers.push(user.email);
                // look each associated doc if current logged in user is allowed
                user.docs.forEach((doc) => {
                    // users allowed to edit (each user is an object with key 'email') of this doc
                    doc.allowed_users.forEach((allowed_user) => {
                        // if user is allowed for this doc, then push doc into allowedDocs array
                        if (allowed_user.email === this.state.currentUser) {
                            allowedDocs.push(doc)
                        }
                    })
                })
            })
        })
        await this.setState({ allowedDocs: allowedDocs })
        await this.setState({ allUsers: allUsers })
    }

    // MOTSVARIGHET MED GET REQUEST
    //     await axios.get(`${server}/users`)
    //         .then(res => {
    //             let usersArray = res.data.data[0].Users;
    //             // for each user...
    //             usersArray.forEach((user) => {
    //                 // collect every created user in database
    //                 allUsers.push(user.email);
    //                 // look each associated doc if current logged in user is allowed
    //                 user.docs.forEach((doc) => {
    //                     // go through each allowed user of this doc
    //                     doc.allowed_users.forEach((allowed_user) => {
    //                         // if user is allowed for this doc, then push doc into allowedDocs array
    //                         if (allowed_user.email == this.state.currentUser) {
    //                             allowedDocs.push(doc)
    //                         }
    //                     })
    //                 })
    //             })
    //         })
    //     await this.setState({ allowedDocs: allowedDocs })
    //     await this.setState({ allUsers: allUsers })
    // }


// ADJUSTED DB WHERE EACH ALLOWED USER NOW IS AN OBJECT
// {
// 	"_id": {
// 		"$oid": "61631746cab3d5fde969ba7d"
// 	},
// 	"Users": [{
// 		"email": "joki20@student.bth.se",
// 		"password": "$2a$09$tihtbxPFSSFBOJ7mn20gyuAQYoweN81zVdM3z1odP44drKhgpbi76",
// 		"docs": [{
// 			"id": "616315285ebfcb13bacec332",
// 			"title": "Den lille pige med svovlstikkerne",
//             "content": "<p title='detta är en kommentar'>Der var engang en liten flikke</p><p><br></p><p>hej</p>",
//             "type": "document",
//             "allowed_users": [
//                 {
//                     "email": "joki20@student.bth.se"
//                 },
//                 {
//                     "email": "abc@student.bth.se"
//                 }
//             ]
// 		}]
// 	}, {
// 		"email": "abc@student.bth.se",
// 		"password": "$2a$09$3mKfFqXD0lgLyOeBKFqk4uzknzu7rr3EzNU/.V9XCervJ7c0A8Mei",
// 		"docs": []
// 	}, {
// 		"email": "johan@student.bth.se",
// 		"password": "$2a$09$ik.zN7Egd7g2bKe4nj4GZu3BsrOA7I.Y.UnToHLKuJyunHHsl7Sfu",
// 		"docs": []
// 	}]
// }
            
            

    // // MOUNT DATABASE DATA
    // async componentDidMount() {
    //     await this.getDatabase()
    // }

    postDatabase = (titleInp) => {
        // post as query /create?title=title&content=text&type=document eller code

        let contentType;

        if (this.state.type === "document") {
            contentType = this.state.currentContent
        }

        if (this.state.type === "code") {
            contentType = this.state.currentCode;
        }
        
        axios.post(`${server}/create`, {
            email: this.state.currentUser,
            title: titleInp,
            content: contentType,
            type: this.state.type
        })

        this.getDocs();
    }

    updateDatabase = async (cont) => {
        this.setState({ messageStatus: "Title content updated" });
        await axios.post(`${server}/update/`, {
            docOwner: this.state.clickedDocOwner,
            docId: this.state.clickedDocId,
            content: cont,
            type: this.state.type
        })
            .then(res => {
                console.log(res.status) // 204 if successful
            })
            .catch(err => console.warn(err));
    }

    // SETSTATE: arrow function will prevent 'this.setState is not a function
    getCurrentInput = (innerHTML) => {
        this.setState({ currentContent: innerHTML });

        // get title input and look for match in order get correct id
        var titleInput = document.getElementsByClassName("titleInput")[0].value;
        var id = null;

        this.state.allowedDocs.forEach((doc) => {
            if (doc.title === titleInput) {
                id = doc.id;
            }
        })

        // if you are within allowed_users array, create socket
        if (this.state.allowedUsers.includes(this.state.currentUser)) {
            // emit object with id and content to backend in order to create room
            let doc = {
                _id: id,
                html: this.state.currentContent
            }
            socket.emit("create", doc)

            // received from server to all clients, containing data.html
            socket.on("doc", (data) => {
                this.setState({ currentContent: data.html })
            });
        }
    }

    clickTitle = async (e) => {
        let clickedTitle = e.target.innerHTML; // get title from click
        let allowedUsers = [];
        let unallowedPersons = [];
        let quill = document.getElementsByClassName("Quill")[0];
        let executeBtn = document.getElementsByClassName("ExecuteCodeBtn")[0];
        let pdfBtn = document.getElementsByClassName("PdfBtn")[0];
        let codemirror = document.getElementsByClassName("react-codemirror2")[0];

        this.setState({ currentTitle: clickedTitle })
        
        //await meaning finish this before next await
        await this.state.allowedDocs.forEach((doc) => {
            // add title
            document.getElementsByClassName("titleInput")[0].value = doc.title;
            // if match is found in db
            if (doc.title === clickedTitle) {

                doc.allowed_users.forEach((allowed_user) => {
                    allowedUsers.push(allowed_user.email);
                })

                this.setState({ type: doc.type })
                this.setState({ allowedUsers: allowedUsers }) // array with emails
                this.setState({ clickedDocId: doc.id })
                this.setState({ clickedDocOwner: doc.allowed_users[0].email }) // first person in allowed_users always owns document

                if (doc.type === "document") {
                    // show normal editor
                    quill.classList.remove("hideEditor");
                    codemirror.classList.add("hideEditor");
                    executeBtn.classList.add("hidden");
                    pdfBtn.classList.remove("hidden");
                    
                    // empty content, since clicking on title will append <p> rows
                    document.getElementsByClassName("ql-editor")[0].innerHTML = '';
                    // this.setState({ currentContent: doc.content })

                    // SAVE COMMENTS IN THIS DOC
                    // convert each <p></p> string to html and return to array of rows
                    var parser = new DOMParser();
                    var docu = parser.parseFromString(doc.content, 'text/html');
                    
                    var htmlCollection = docu.body.children;

                    // // for each <p> tag with comment, add to content. This will make content have title attributes
                    htmlCollection.forEach((row) => {
                        let cloneRow = row.cloneNode(true);
                        document.getElementsByClassName("ql-editor")[0].appendChild(cloneRow);
                    })
                    // // if first <p> only contains <br>, remove it
                    if (document.querySelector(".ql-editor").firstChild.firstChild.nodeName === "BR") {
                        document.querySelector(".ql-editor").firstChild.remove();
                    }
                }
                
                if (doc.type === "code") {
                    // show codemirror editor
                    quill.classList.add("hideEditor");
                    codemirror.classList.remove("hideEditor");
                    executeBtn.classList.remove("hidden");
                    pdfBtn.classList.add("hidden");

                    // add content to doc
                    document.querySelector('.CodeMirror').CodeMirror.setValue(doc.content)
                }
            }
        })

        // await this.setState({ currentComments: rowsArray })
        htmlRowsArray = htmlCollection;

        // if user is not allowed, add to list of unallowed users
        await this.state.allUsers.forEach((user) => {
            if (!this.state.allowedUsers.includes(user)) {
                unallowedPersons.push(user);
            }
        })
        this.setState({ unallowedUsers: unallowedPersons })

        // SHOW invite content
        document.getElementsByClassName("inputInvitation")[0].classList.remove("hidden");
        document.getElementsByClassName("InviteBtn")[0].classList.remove("hidden");
        // SHOW save button
        document.getElementsByClassName("SaveBtn")[0].classList.remove("hidden");
        // SHOW correct button: 'Create PDF' or 'Execute Code'
    }

    
    save = async () => {
        let titleExists = "no";

        if (this.state.token === "") {
            return this.setState({ messageStatus: "You must be logged in" });
        }
        // get text of title input
        var titleInput = document.getElementsByClassName("titleInput")[0].value;
        var id = null;

        if (!titleInput) {
            return this.setState({ messageStatus: "You must provide a title" });
        }
        
        // forEach((element) => { ... } )
        this.state.allowedDocs.forEach((doc) => {
            // check for match, and if so do an update
            if (doc.title === titleInput) {
                this.setState({ clickedDocId: doc.id });
                // owner is always first in array_users
                this.setState({ clickedDocOwner: doc.allowed_users[0].name })

                titleExists = "yes";
                id = doc.id;
                this.updateDatabase(this.state.currentContent)
            }
        }) // stop loop

        // IF TITLE DOESN'T EXIST
        if (titleExists === "no") {
            this.setState({ messageStatus: "New entry created" });
            await this.postDatabase(titleInput);
        }
    }

    register = async (e) => {
        e.preventDefault();

        let mail = document.getElementsByClassName("email")[0].value;
        let password = document.getElementsByClassName("password")[0].value;

        // register user
        await axios.post(`${server}/register`, {
            email: mail,
            password: password
        })
        
        document.getElementsByClassName("email")[0].value = '';
        document.getElementsByClassName("password")[0].value = '';
        return this.setState({ landingPageMessage: `${mail} was registered` });
    }

    login = async (e) => {
        e.preventDefault();
        let mail = document.getElementsByClassName("email")[0].value
        let password = document.getElementsByClassName("password")[0].value
        let match = 'no';

        this.setState({ currentUser: mail })

            // if no email or password, exit function
        if (!mail || !password) {
            return this.setState({ messageStatus: "Email or password missing" });
        }

        await axios.get(`${server}/users`)
            .then(res => {
                // get array of users
                let usersArray = res.data.data[0].Users
                // check if user exists
                usersArray.forEach((user) => {
                    if (user.email === mail) {
                        match = "yes"
                    }
                })
            })

            // if not, show message
            if (match === "no") {
                this.setState({ messageStatus: "Sorry, but email doesn't exist" });
            }
            // if match, send email and password to backend and create JWT
            if (match === "yes") {
                // send email and password to backend, process login and return JWT
                await axios.post(`${server}/login`, {
                    email: mail,
                    password: password
                })
                // if successful login response containsjwt, oherwise undefined
                    .then(res => {
                        let gotToken = res.data.data

                        if (gotToken) {
                            this.setState({ token: res.data.data })                            
                        }
                })
                .catch(err => console.warn(err));
            }
        // setState to update array
        this.getDocs()

        this.setState({ messageStatus: '' })
    }

    logout = async () => {
        this.setState({ currentUser: "" })
        this.setState({ token: "" })
        this.setState({ allowedDocs: [] })
        this.setState({ allowedUsers: [] })
        this.setState({ unallowedPersons: [] })
        this.setState({ currentTitle: '' })
        this.setState({ currentContent: '' })
        document.getElementsByClassName("titleInput")[0].value = ''
    }

    allowUser = async (e) => {
        e.preventDefault();
        let clickedUser = e.target.innerHTML;

        // function for adding user to allowed_users for this doc
        await axios.post(`${server}/allow_user`, {
            email: clickedUser,
            currentUser: this.state.currentUser,
            docId: this.state.clickedDocId
        })

        // allow user in frontend
        let allowed = this.state.allowedUsers;

        allowed.push(clickedUser);
        this.setState({ allowedUsers: allowed })

        // delete user from unallowedUsers in frontend
        const index = this.state.unallowedUsers.indexOf(clickedUser);
        let unallowed = this.state.unallowedUsers;
        // remove user
        unallowed.splice(index, 1);
        this.setState({ unallowedUsers: unallowed})

        return this.setState({ messageStatus: `${clickedUser} is now allowed to edit this document` });
    }

    // Here is your export function
    // Typically this would be triggered by a click on an export button
    savePDF = async () => {
        let pdfContent = `<h1>${this.state.currentTitle}</h1>${this.state.currentContent}`;
        var opt = {
            margin:       1,
            filename:     'myfile.pdf',
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
          };
        
        html2pdf(pdfContent, opt);
    }

    sendMail = async (e) => {
        let inputEmail = document.getElementsByClassName("inputInvitation")[0].value;
        await axios.post(`${server}/sendmail`, {
            email: inputEmail,
            currentUser: this.state.currentUser,
            docId: this.state.clickedDocId,
            title: this.state.currentTitle,
        })     

        this.setState({ messageStatus: "Invitation email was sent" });

        // do some error handling before this, if user inputs an invalid or already occurring email
        await axios.post(`${server}/allow_user`, {
            email: inputEmail,
            currentUser: this.state.currentUser,
            docId: this.state.clickedDocId
        })

        let addedAllowedUsers = this.state.allowedUsers;

        addedAllowedUsers.push(inputEmail);
        
        this.setState({ allowedUsers: addedAllowedUsers })

        // empty input
        document.getElementsByClassName("inputInvitation")[0].value = '';
    }

    switchEditor = async (e) => {
        let quill = document.getElementsByClassName("Quill")[0];
        let codemirror = document.getElementsByClassName("react-codemirror2")[0];
        let executeBtn = document.getElementsByClassName("ExecuteCodeBtn")[0];
        let pdfBtn = document.getElementsByClassName("PdfBtn")[0];
        
        quill.classList.toggle("hideEditor");
        codemirror.classList.toggle("hideEditor");
        // from pdf button to code button
        if (this.state.type === "document") {
            this.setState({ type: "code" })
            document.getElementsByClassName("ExecuteCodeBtn")[0].classList.remove("hidden");
            pdfBtn.classList.add("hidden");
        }
        // from code button to pdf button
        if (this.state.type === "code") {
            this.setState({ type: "document" })
            document.getElementsByClassName("ExecuteCodeBtn")[0].classList.add("visible");
            pdfBtn.classList.remove("hidden");
        }
    }

    executeCode = async (e) => {
        // only if in code mode
        if (this.state.type === "code") {
            let quill = document.getElementsByClassName("Quill")[0];
            let jsLinesArray = document.querySelectorAll("span[role='presentation']");
            let jsCode = "";

            jsLinesArray.forEach((line) => {
                jsCode += line.textContent;
            })

            let base64String = btoa(String(this.state.currentCode));

            await axios.post(`https://execjs.emilfolino.se/code`, {
                code: base64String,
            }).then((res) => {
                // display returned message
                this.setState({ messageStatus: res.data.data })
            })
        }
    }

    saveComment = async (e) => {
        let commentsTextarea = document.querySelector(".Comments > textarea");

        // COMMENTS
        var temp = document.createElement( 'div' );
        temp.innerHTML = this.state.currentContent;
        let htmlCollectionRows = temp.children;

        // set title to clicked element
        htmlCollectionRows[rowIndex].setAttribute('title', commentsTextarea.value);
        // // empty ql editor
        document.getElementsByClassName("ql-editor")[0].textContent = '';
        // // add rows with edited title comment
        // // for each <p> tag with comment, add to content.
        // arrayRows.forEach((row) => {
        //     document.getElementsByClassName("ql-editor")[0].appendChild(row);
        // })

        // convert htmlCollection to array...
        var arr = [].slice.call(htmlCollectionRows);
        var strContent = '';
        // update element string for database re-add to ql editor
        arr.forEach((row) => {
            row.removeAttribute("style");
            strContent += row.outerHTML;
            document.getElementsByClassName("ql-editor")[0].appendChild(row);
        })

        this.updateDatabase(strContent);

        this.setState({ messageStatus: "Comment added to row" });

        // hide button and remove highlighting
        document.querySelector(".Comments > textarea").classList.add("hidden")
        document.querySelector(".Comments > button").classList.add("hidden")
        htmlCollection = [...document.getElementsByClassName("ql-editor")[0].children]
        for (let [i, row] of htmlCollection.entries()) {
            console.log(i);
            row.removeAttribute("style");
        }
    }

    render() {
        return (
            <div className="App">
                <LandingPage
                    // functions for register and login
                    handleRegister={this.register}
                    handleLogin={this.login}
                    token={this.state.token} // if exists, will show AuthForm
                    landingPageMessage={this.state.landingPageMessage}
                />
                <Toolbar
                    messageStatus={this.state.messageStatus}
                    currentUser={this.state.currentUser}
                    logout={this.logout}
                />
                <Title currentTitle={this.state.currentTitle} />
                <ListDocs listDocs={this.state.allowedDocs} clickTitle={this.clickTitle} />
                <Comments saveComment={this.saveComment} />
                <ListUsers allowedUsers={this.state.allowedUsers} />
                <AddUsers allUsers={this.state.allUsers} unallowedUsers={this.state.unallowedUsers} allowUser={this.allowUser} />
                <InviteUsers sendMail={this.sendMail} />
                <ReactQuill
                    className="Quill"
                    theme="snow"
                    value={this.state.currentContent}
                    onChange={this.getCurrentInput}
                />
                <CodeMirror
                    className="hideEditor"
                    value={this.state.value}
                    options={{
                        readOnly: false,
                        lineWrapping: true,
                        lineNumbers: true,
                        lint: true,
                        cursorBlinkRate: 1000,
                        tabindex: 3,
                        indentWithTabs: true,
                        mode: 'javascript',
                        theme: 'material'
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({ currentCode: editor.getValue() });
                        this.setState({ value });
                      }}
                    onChange={(editor, data, value) => {
                        this.setState({ currentCode: editor.getValue() });
                        console.log(this.state.currentCode);
                      }}
                />
                <SwitchEditorBtn switchEditor={this.switchEditor} />
                <ExecuteCodeBtn executeCode={this.executeCode} />
                <PdfBtn savePDF={this.savePDF} />
                <SaveBtn saveContent={this.save} />
            </div>
        );
    }
}

export default App