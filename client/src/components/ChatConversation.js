import React, { Component } from "react";
import moment from "moment";
import { emit } from "../sockets/index";
import TYPES from "../sockets/types";
import styled from "styled-components";
import { Card, Input, SmallButton } from "../styles/common";
import { BORDER_COLOR } from "../styles/variables";

const Container = Card.extend`
  padding: 0;
  transition: transform 0.2s ease-out;
  margin-bottom: 1px;

  ${props =>
    !props.visible &&
    `
    transform: translateY(330px);
  `};
`;

const Header = styled.div`
  position: relative;
  padding-right: 20px;
  background-color: #333;
  color: white;
  font-weight: 100;
  padding: 12px;
  font-size: 13px;
  cursor: pointer;

  p {
    margin: 0;
  }

  button {
    position: absolute;
    top: 3px;
    right: 3px;
    background: none;
    border: none;
    color: white;
    font-size: 25px;
    cursor: pointer;
  }
`;

const Messages = styled.form`
  min-height: 300px;
  height: 300px;
  overflow-y: auto;
`;

const Footer = styled.form`
  border-top: 1px solid ${BORDER_COLOR};
  display: flex;

  input {
    font-size: 12px;
    width: 200px;
    height: 27px;
    margin: 0;
    border: none;
    padding: 3px 6px;
  }
`;

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
        <div key={message.date}>
          <p>
            {message.author.pseudo} | {formattedDate}
          </p>
          <p>{message.text}</p>
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
      <Container visible={this.state.visible}>
        <Header onClick={this.toggleChat}>
          <p>
            {this.props.conversation.users
              .map(({ pseudo }) => pseudo)
              .join(", ")}
          </p>
          <button type="button">{this.state.visible ? "-" : "+"}</button>
        </Header>
        <Messages>{this.renderMessages()}</Messages>
        <Footer onSubmit={this.sendMessage}>
          <Input
            type="text"
            value={this.state.message}
            onChange={this.handleChange}
            placeholder="Ecrivez votre message"
          />
          <SmallButton type="submit">Envoyer</SmallButton>
        </Footer>
      </Container>
    );
  }
}
