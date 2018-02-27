import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import { subscribe } from "../sockets/index";
import TYPES from "../sockets/types";

import ChatConversation from "../components/ChatConversation";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";

const ChatContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 3px;
  display: flex;

  h2 {
    font-family: "Lobster";
    font-size: 20px;
    align-items: flex-end;
    margin: 0 12px 0 0;
  }

  ul {
    top: auto;
    bottom: 100%;
  }

  form > div {
    bottom: 100%;
    top: auto;
  }
`;

const Friends = styled.ul`
  /* position: absolute;
  bottom: 100%;
  background: white;
  top: auto;
  border: 1px solid red; */
`;

const ChatConversations = styled.div`
  position: fixed;
  bottom: 0;
  left: 10px;
`;

class Chat extends Component {
  state = {
    friends: [],
    conversations: [],
    loading: true
  };

  getConversation = id => {
    const matchingConversation = this.state.conversations.find(({ users }) =>
      users.some(user => user._id === id)
    );

    if (matchingConversation) {
      return;
    }

    get(`/chat/${id}`)
      .then(conversation => {
        this.setState({
          conversations: this.state.conversations.concat(conversation)
        });
      })
      .catch(error => {
        console.log("getConversation", error);
      });
  };

  componentDidMount() {
    subscribe(TYPES.ON_CHAT_MESSAGE, payload => {
      console.log(payload);
      const message = payload.message;
      let conversations = this.state.conversations;
      if (conversations.length > 0) {
        conversations.forEach(conversation => {
          if (conversation._id === payload.conversationId) {
            if (!conversation.messages) {
              conversation.messages = [];
            }
            conversation.messages.push(message);
          } else {
            this.getConversation(payload.message.author);
          }
        });
      } else {
        this.getConversation(payload.message.author);
      }
      this.setState({
        conversations: conversations
      });
    });
  }

  renderFriend = friend => {
    return (
      <li key={friend._id} onClick={id => this.getConversation(friend._id)}>
        {friend.pseudo}
      </li>
    );
  };

  render() {
    return (
      <ChatContainer>
        <h2>Chat:</h2>
        <SearchBar
          onSubmit={this.getConversation}
          onSelect={this.getConversation}
          requestPath="/users/search/friends/"
          placeholder="Chercher un ami"
        />
        {!this.state.loading && (
          <Friends className="friends">
            {this.state.friends.map(this.renderFriend)}
          </Friends>
        )}
        <ChatConversations>
          {this.state.conversations.map(conversation => (
            <ChatConversation
              key={conversation._id}
              conversation={conversation}
            />
          ))}
        </ChatConversations>
      </ChatContainer>
    );
  }
}

export default withRouter(props => <Chat {...props} />);
