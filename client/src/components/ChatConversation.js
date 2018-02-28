import React, { Component } from "react";
import moment from "moment";
import { emit } from "../sockets/index";
import TYPES from "../sockets/types";
import classnames from "classnames";
import "../styles/ChatConversation.css";

export default class ChatConversation extends Component {
  state = {
    message: "",
    visible: true
  };
  populateMessageWithPseudo = message => {
    const authorId = message.author;
    const currentUser = this.props.conversation.users.filter(user => {
      return user._id === authorId;
    });
    return {
      _id: currentUser[0]._id,
      pseudo: currentUser[0].pseudo
    };
  };

  renderMessages = () => {
    const { messages = [] } = this.props.conversation;

    return messages.map(message => {
      if (message.author && typeof message.author === "string") {
        message.author = this.populateMessageWithPseudo(message);
      }
      const formattedDate = moment(message.date).fromNow();

      return (
        <div
          key={message.date}
          className={classnames("ChatConversation__message", {
            "ChatConversation__message--current":
              message.author._id === this.props.user.id
          })}
        >
          <div className="ChatConversation__message__user">
            {message.author.pseudo} | {formattedDate}
          </div>
          <p className="ChatConversation__message__text">{message.text}</p>
        </div>
      );
    });
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

  toggleChat = event => {
    event.preventDefault();
    this.setState({
      visible: !this.state.visible
    });
  };

  render() {
    return (
      <div
        className={classnames("ChatConversation", {
          "ChatConversation--visible": this.state.visible
        })}
      >
        <div className="ChatConversation__header" onClick={this.toggleChat}>
          <p>
            {this.props.conversation.users
              .map(({ pseudo }) => pseudo)
              .join(", ")}
          </p>
        </div>
        <div className="ChatConversation__messages">
          {this.renderMessages()}
        </div>
        <form className="ChatConversation__footer" onSubmit={this.sendMessage}>
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleChange}
            placeholder="Ecrivez votre message"
          />
          <button className="button-small" type="submit">
            Envoyer
          </button>
        </form>
      </div>
    );
  }
}
