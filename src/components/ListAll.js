import React from 'react';
import axios from 'axios'; // database requests

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
                <select onChange={this.props.renderContentAfterChoice}>
                    <option defaultValue disabled={true}>
                        --- Create or edit document ---
                    </option>
                    <option text="">Create new</option>
                    <option disabled={true}></option>

                    {this.state.documents.map((doc) => (
                      <option
                        key={doc._id}
                        name={doc._id}
                        title={doc.title}
                        text={doc.content}>{doc.title}</option>
                    ))}
                  </select>
                <input type="hidden"></input>
                <input type="submit" onClick={this.props.createOrSaveDocument} className="btn save"></input>
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