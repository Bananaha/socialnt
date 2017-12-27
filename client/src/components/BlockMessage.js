import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class BlockMessage extends Component {
  state = {
    userMessage: "",
    alert: "",
    attachment: ""
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitMessage = event => {
    event.preventDefault();
    const messageInfos = {
      autorPseudo: this.props.match.params.pseudo,
      message: this.state.userMessage
    };

    post("/message/newMessage", messageInfos)
      .then(result => {
        this.setState({
          alert: result.message,
          userMessage: ""
        });
        setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
      })
      .catch(error => {
        this.setState({ alert: error.message });
      });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitMessage}>
          <textarea
            name="userMessage"
            cols="30"
            rows="10"
            onChange={this.handleChange("userMessage")}
          />
          <button type="submit">Publier</button>
        </form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <BlockMessage {...props} />);
