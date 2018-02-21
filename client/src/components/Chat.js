import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import { subscribe } from "../sockets/index";
import TYPES from "../sockets/types";

import ChatConversation from "../components/ChatConversation";
import SearchBar from "../components/SearchBar";

class Chat extends Component {
  state = {
    friends: [],
    conversations: [],
    loading: true
  };

  getConversation = id => {
    // TODO: afficher une boite de chat, vide
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
      const message = payload.message;
      let conversations = this.state.conversations;
      if (conversations.length > 0) {
        conversations.forEach(conversation => {
          if (conversation._id === payload.conversationId) {
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
      <div>
        <h2>Chat</h2>
        <SearchBar
          onSubmit={this.getConversation}
          onSelect={this.getConversation}
          requestPath="/users/search/friends/"
          placeholder="Chercher un ami"
        />
        {this.state.loading ? (
          ""
        ) : (
          <ul>{this.state.friends.map(this.renderFriend)}</ul>
        )}
        {this.state.conversations.map(conversation => (
          <ChatConversation
            key={conversation._id}
            conversation={conversation}
          />
        ))}
      </div>
    );
  }
}
// icone chat
// qd on clique dessus un input apparait
// on entre le nom de l'ami avec lequel on veut chatter
// on commence à chatter

// si je reçois un message chat
// la conversation s

export default withRouter(props => <Chat {...props} />);
