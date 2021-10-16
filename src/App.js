import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toolbar from "./components/Toolbar";
import ListDocs from "./components/ListDocs.js";
import ListUsers from "./components/ListUsers.js";
import AddUsers from "./components/AddUsers.js";
import Title from "./components/Title.js";
import axios from 'axios'; // database requests
import './App.css';
import 'react-quill/dist/quill.bubble.css';
// io is a function to call an individual socket
import io from "socket.io-client";

// let server = `http://localhost:1337`;
let server = `https://jsramverk-editor-joki20.azurewebsites.net`
const socket = io("http://student.bth.se"); // http://localhost:3000

class App extends React.Component {
    constructor(props) {
        super(props);

        // CURRENT STATE
        this.state = {
            allUsers: [],
            allowedDocs: [],
            allowedUsers: [],
            unallowedUsers: [],
            currentTitle: '',
            currentContent: '',
            messageStatus: '',
            token: "", // if token is set, user is logged in
            currentUser: "",
            clickedDocId: "",
            clickedDocOwner: "",
        };
    }

    socketUpdateContent(content) {
        this.setState({ currentContent: content })
    }

    getDocs = async () => {
        console.log("getDocs was called")
        let allUsers = []
        let allowedDocs = [];
        
        await axios.get(`${server}/users`)
            .then(res => {
                let usersArray = res.data.data[0].Users;
                // for each user...
                usersArray.forEach((user) => {
                    // collect every created user in database
                    allUsers.push(user.email);
                    // look each associated doc if current logged in user is allowed
                    user.docs.forEach((doc) => {
                        // if user is allowed for this doc, then push doc into allowedDocs array
                        if (doc.allowed_users.includes(this.state.currentUser)) {
                            allowedDocs.push(doc)
                        }
                    })
                })
            })
        await this.setState({ allowedDocs: allowedDocs })
        await this.setState({ allUsers: allUsers })
    }
            
            

    // // MOUNT DATABASE DATA
    // async componentDidMount() {
    //     await this.getDatabase()
    // }

    postDatabase = (titleInp) => {
        // post as query /create?title=titel&content=text
        axios.post(`${server}/create`, {
            email: this.state.currentUser,
            title: titleInp,
            content: this.state.currentContent
        })

        this.getDocs();
    }

    updateDatabase = async () => {
        await axios.post(`${server}/update/`, {
            docOwner: this.state.clickedDocOwner,
            docId: this.state.clickedDocId,
            content: this.state.currentContent
        })
            .then(response => response.status)
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
                id = doc._id;
            }
        })
            
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

    getCurrentTitle = (innerHTML) => {
        this.setState({ currentTitle: innerHTML });
    }

    clickTitle = async (e) => {
        let clickedTitle = e.target.innerHTML; // get title from click
        let unallowedPersons = [];
        console.log("CLICKED TITLE")
        console.log(e)
        
        //await meaning finish this before next await
        await this.state.allowedDocs.forEach((doc) => {
            if (doc.title === clickedTitle) {
                console.log(doc)
                document.getElementsByClassName("titleInput")[0].value = doc.title;
                // setState title and content
                this.setState({ currentTitle: doc.title })
                this.setState({ currentContent: doc.content })
                this.setState({ allowedUsers: doc.allowed_users })
                this.setState({ clickedDocId: doc.id })
                this.setState({ clickedDocOwner: doc.allowed_users[0] }) // first person in allowed_users always owns document
            }
        })

        // if user is not allowed, add to list of unallowed users
        await this.state.allUsers.forEach((user) => {
            if (!this.state.allowedUsers.includes(user)) {
                unallowedPersons.push(user);
            }
        })
        this.setState({ unallowedUsers: unallowedPersons })
    }

    
    save = async () => {
        let titleExists = "no";

        if (this.state.token == "") {
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
                this.setState({ clickedDocOwner: doc.allowed_users[0] })

                this.setState({ messageStatus: "Title content updated" });
                titleExists = "yes";
                id = doc.id;
                this.updateDatabase()
            }
        }) // stop loop

        // IF TITLE DOESN'T EXIST
        if (titleExists === "no") {
            console.log("Title doesn't exist")
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
        return this.setState({ messageStatus: `${mail} was added, try to login` });

        console.log("register")
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
                console.log(usersArray)
                // check if user exists
                usersArray.forEach((user) => {
                    console.log(user.email)
                    if (user.email === mail) {
                        match = "yes"
                    }
                })
            })

            // if not, show message
            if (match === "no") {
                this.setState({ messageStatus: "Sorry, but email doesn't exist" });
            }
            // if match, send emaeil and password to backend and create JWT
            if (match === "yes") {
                console.log("matching email was found")
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
        console.log("clicked user to remove:")
        console.log(clickedUser)


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

    render() {
        return (
            <div className="App">
                <Toolbar
                    saveContent={this.save}
                    messageStatus={this.state.messageStatus}
                    // functions for register and login
                    handleRegister={this.register}
                    handleLogin={this.login}
                    token={this.state.token} // if exists, will show AuthForm
                    currentUser={this.state.currentUser}
                    logout={this.logout}
                />
                <Title onChange={this.getCurrentTitle} />
                <ListDocs listDocs={this.state.allowedDocs} clickTitle={this.clickTitle} />
                <ListUsers allowedUsers={this.state.allowedUsers} />
                <AddUsers allUsers={this.state.allUsers} unallowedUsers={this.state.unallowedUsers} allowUser={this.allowUser} />
                <ReactQuill
                    className="Quill"
                    theme="snow"
                    value={this.state.currentContent}
                    onChange={this.getCurrentInput}
                />
            </div>
        );
    }
}

export default App