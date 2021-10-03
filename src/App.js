import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toolbar from "./components/Toolbar";
import ListAll from "./components/ListAll.js";
import Title from "./components/Title.js";
import axios from 'axios'; // database requests
import './App.css';
import 'react-quill/dist/quill.bubble.css';


class App extends React.Component {
    constructor(props) {
        super(props);

        // CURRENT STATE
        this.state = {
            listDocuments: [],
            currentTitle: '',
            currentContent: '',
            messageStatus: '',
        };

        // preventing componentDidUpdate to run when page loads
        this.firstUpdate = "yes"; 

    }

    getDatabase = () => {
        axios.get(`https://jsramverk-editor-joki20.azurewebsites.net/list`)
        .then(res => {
            this.setState({ listDocuments: res.data.data }); //activates componentDidUpdate
        })
    }

        // MOUNT DATABASE DATA
        async componentDidMount() {
            await this.getDatabase()
        }

    postDatabase = async (titleInp) => {
        // post as query /create?title=titel&content=text
        await axios.post(`https://jsramverk-editor-joki20.azurewebsites.net/create`, {
            title: titleInp,
            content: this.state.currentContent
        })
            .then((response) => {
                console.log(response);
        })
            .then((error) => {
                console.log(error);
            })
        
        this.getDatabase();
    }

    updateDatabase = async (id) => {
        console.log(id);
        await axios.post(`https://jsramverk-editor-joki20.azurewebsites.net/update/${id}`, {
            title: this.state.currentTitle,
            content: this.state.currentContent
        })
            .then(response => response.status)
            .catch(err => console.warn(err));
    }

    // SETSTATE: arrow function will prevent 'this.setState is not a function
    getCurrentInput = (innerHTML) => {
        this.setState({ currentContent: innerHTML });
    }

    getCurrentTitle = (innerHTML) => {
        this.setState({ currentTitle: innerHTML });
    }

    clickTitle = (e) => {
        let clickedTitle = e.target.innerHTML; // get title from click
        this.state.listDocuments.forEach((doc) => {
            if (doc.title == clickedTitle) {
                document.getElementsByClassName("titleInput")[0].value = doc.title;
                // setState title and content
                this.setState({ currentTitle: doc.title })
                this.setState({ currentContent: doc.content })
            }
        })
    }

    
    save = () => {
        let titleExists = "no";
        console.log("SAVING")

        // get text of title input
        var titleInput = document.getElementsByClassName("titleInput")[0].value;
        var id = null;
        
        // forEach((element) => { ... } )
        this.state.listDocuments.forEach((doc) => {
            // check for match, and if so do an update
            if (doc.title == titleInput) {
                this.setState({ messageStatus: "Title content updated" });
                titleExists = "yes";
                id = doc._id;
                this.updateDatabase(id)
            }
        }) // stop loop

        // IF TITLE DOESN'T EXIST
        if (titleExists == "no") {
            this.setState({ messageStatus: "New entry created" });
            this.postDatabase(titleInput);
        }
    }

    render() {
        return (
            <div className="App">
                <Toolbar
                    saveContent={this.save}
                    messageStatus={this.state.messageStatus}
                />
                <ListAll listDocs={this.state.listDocuments} clickTitle={this.clickTitle} />
                <Title onChange={this.getCurrentTitle} />
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