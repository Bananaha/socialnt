import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";
import BlockMessage from "./BlockMessage";

class MessagesList extends Component {
  state = {
    messages: "",
    nbMessages: "",
    pagination: "",
    alert: "",
    loader: true
  };

  // compute pagination based on messages number
  computeMessages = messages => {
    console.log(messages);
    let pages = [];
    for (let i = messages.nbMessages, nbPages = 1; i > 0; i -= 10, nbPages++) {
      pages.push(nbPages);
    }
    this.setState({
      pagination: pages,
      messages: messages.messages,
      nbMessages: messages.nbMessages,
      loader: false
    });
  };

  // request all messages where the author or recipient is the profile owner
  updateMessages = page => {
    const id = this.props.match.params.id;
    get(`/message/${id}/${page}`)
      .then(result => {
        this.computeMessages(result);
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
    this.updateMessages();
  }

  loadNextMessages = page => event => {
    event.preventDefault();

    this.updateMessages(page);
  };

  render() {
    return (
      <div>
        <BlockMessage onSubmit={this.updateMessages} />
        {this.state.loader ? (
          <p>Loading..</p>
        ) : (
          <div>
            <div>
              {this.state.messages.map((message, index) => {
                return (
                  <div>
                    <div>
                      {message.dest ? (
                        <div>
                          <span key={index + message.autor}>
                            {message.autor}
                          </span>
                          <span> | </span>
                          <span key={index + message.dest}>{message.dest}</span>
                        </div>
                      ) : (
                        <span key={index + message.autor}>{message.autor}</span>
                      )}
                    </div>

                    <p key={index + message.content}>{message.content}</p>
                    <span key={index + message.date}>{message.date}</span>
                  </div>
                );
              })}
            </div>
            <div>
              {this.state.pagination.map((page, index) => {
                return (
                  <button onClick={this.loadNextMessages(page)} key={index}>
                    {page}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <MessagesList {...props} />);
