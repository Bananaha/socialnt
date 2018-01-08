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
    const id = this.props.match.params.id;
    get("/message/" + id)
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
          alert: error.alert
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
                  <div>
                    {message.dest ? (
                      <div>
                        <span key={message._id}>{message.autor}</span>
                        <span> | </span>
                        <span key={message._id}>{message.dest}</span>
                      </div>
                    ) : (
                      <span key={message._id}>{message.autor}</span>
                    )}
                  </div>

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
