import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class MessagesList extends Component {
  state = {
    messages: "",
    alert: "",
    loader: true
  };

  updateWallMessages = () => {
    const pseudo = this.props.match.params.pseudo;
    get("/message/" + pseudo)
      .then(result => {
        console.log(result.messages);
        this.setState({
          messages: result.messages,
          loader: false
        });
        console.log(this.state.messages);
      })
      .catch(error => {
        console.log(error);
        this.setState({
          alert: error
        });
        setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
      });
  };

  componentDidMount() {
    this.updateWallMessages();
  }

  render() {
    return (
      <div>
        {this.state.loader ? (
          <p>Loading..</p>
        ) : (
          <div>
            {this.state.messages.map((message, index) => {
              return (
                <div>
                  <span key={message._id}>{message.autor}</span>
                  <span key={message._id}>{message.dest}</span>
                  <p key={message._id}>{message.content}</p>
                  <span key={message._id}>{message.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <MessagesList {...props} />);