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
    conversationHistoric: ["toto"],
    loader: true
  };

  selectFriend = id => {
    console.log(id);
    get(`/chat/${id}`)
      .then(conversation => {
        console.log("conversationexists", conversation);
        if (conversation) {
          if (!conversation.historic) {
            console.log("conversationdoesntexist");
            this.setState({
              loader: false
            });
          } else {
            this.setState({
              conversationHistoric: conversation.historic,
              loader: false
            });
          }
        }
        console.log(this.state.conversationHistoric);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    subscribe(TYPES._ON_CHAT_MESSAGE, payload => {
      console.log("ON_CHAT_MESSAGE");
    });
    get("/users/friends").then(friends => {
      this.setState({ friends });
    });
  }

  renderFriend = friend => {
    return (
      <li key={friend._id} onClick={id => this.selectFriend(friend._id)}>
        {friend.pseudo}
      </li>
    );
  };

  searchUsers = () => {
    console.log("toto");
  };

  render() {
    return (
      <div>
        <h2>Chat</h2>
        <SearchBar onSubmit={this.searchUsers} />
        <ul>{this.state.friends.map(this.renderFriend)}</ul>
        {this.state.loader ? (
          ""
        ) : (
          <ChatConversation historic={this.state.conversationHistoric} />
        )}
      </div>
    );
  }
}

export default withRouter(props => <Chat {...props} />);
/*
- Dans Chat component, souscrire à l'event ON_CHAT_MESSAGE

- je sélectionne un ami -> requête vers seveur pour récupérer une conversation
  Elle existe si je trouve une conversation entre current user et friend
  - si elle existe: return historique + id
  - sinon, la créer et retourner id

- ça ouvre la conversation récupérée -> besoin d'un composant chatConversation qui récupère en props:
  - currentUser (optional)
  - ami
  - historique (messages)

- Quand j'envoi un message, envoi du payload via socket vers le serveur (avec id de conversation)
 - { conversation: '12345', message: 'Coucou' } (auteur dans socketItem.user...)

SERVEUR: 
- listen l'event socket ON_CHAT_MESSAGE (cf dispatcher)
- à la réception du message, maj en bdd + envoi socket aux users avec: 
  - { conversation: '12345', message: 'Coucou', user: '1234' }
*/
