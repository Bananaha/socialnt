import React, { Component } from "react";
import { emit } from "../sockets/index";
import TYPES from "../sockets/types";

export default class ChatConversation extends Component {
  state = {
    message: ""
  };

  renderMessages = () => {
    const { messages = [] } = this.props.conversation;
    return messages.map(message => (
      <div key={message.date}>
        <p>{message.autor}</p>
        <p>{message.text}</p>
        <p>{message.date}</p>
      </div>
    ));
  };

  handleChange = event => {
    const message = event.target.value;
    this.setState({ message: message });
  };

  sendMessage = event => {
    event.preventDefault();
    const message = this.state.message;
    emit(TYPES.SEND_CHAT_MESSAGE, {
      message: message,
      conversationId: this.props.conversation._id
    });
    this.setState({ message: "" });
  };

  closeChat = event => {
    event.preventDefault();
    console.log("hide");
  };

  render() {
    return (
      <div>
        <div>
          <p>
            Conversation de{" "}
            {this.props.conversation.users
              .map(({ pseudo }) => pseudo)
              .join(" / ")}
          </p>
          <button onClick={this.closeChat}>-</button>
        </div>
        <div>{this.renderMessages()}</div>
        <div>
          <form onSubmit={this.sendMessage}>
            <input
              type="text"
              value={this.state.message}
              onChange={this.handleChange}
            />
            <button type="submit" />
          </form>
        </div>
      </div>
    );
  }
}
