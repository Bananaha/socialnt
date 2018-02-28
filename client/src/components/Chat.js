import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import { subscribe } from "../sockets/index";
import TYPES from "../sockets/types";
import ChatConversation from "../components/ChatConversation";
import SearchBar from "../components/SearchBar";
import "../styles/Chat.css";

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

    get(`/chat/${id}`).then(conversation => {
      this.setState({
        conversations: this.state.conversations.concat(conversation)
      });
    });
  };

  componentDidMount() {
    subscribe(TYPES.ON_CHAT_MESSAGE, payload => {
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
      <div className="Chat">
        <h2>Chat:</h2>
        <SearchBar
          onSubmit={this.getConversation}
          onSelect={this.getConversation}
          requestPath="/users/search/friends/"
          placeholder="Chercher un ami"
        />
        {!this.state.loading && (
          <ul className="friends">
            {this.state.friends.map(this.renderFriend)}
          </ul>
        )}
        <div className="Chat__conversations">
          {this.state.conversations.map(conversation => (
            <ChatConversation
              user={this.props.user}
              key={conversation._id}
              conversation={conversation}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(props => <Chat {...props} />);
