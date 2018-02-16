import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import { subscribe } from "../sockets/index";
import TYPES from "../sockets/types";

import ChatConversation from "../components/ChatConversation";
import SearchBar from "../components/SearchBar";

// {
//   _id: 123,
//   users: [
//     {
//       _id: 1,
//       pseudo: "Test"
//     },
//     {
//       _id: 2,
//       pseudo: "Claire"
//     }
//   ],
//   messages: [
//     {
//       text: "coucou",
//       autor: 1,
//       date: 2345667890
//     }
//   ]
// }

class Chat extends Component {
  state = {
    friends: [],
    conversations: [],
    loading: true
  };

  selectFriend = id => {
    // TODO: afficher une boite de chat, vide
    const matchingConversation = this.state.conversations.find(({ users }) =>
      users.some(user => user._id === id)
    );

    if (matchingConversation) {
      return;
    }

    get(`/chat/${id}`)
      .then(conversation => {
        console.log("conversation fetch", conversation);
        this.setState({
          conversations: this.state.conversations.concat(conversation)
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    subscribe(TYPES.ON_CHAT_MESSAGE, payload => {
      console.log("ON_CHAT_MESSAGE", payload);
      // TODO: mettre à jour les messages de la conversation du state
    });
    get("/users/friends").then(friends => {
      this.setState({ friends, loading: false });
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

export default withRouter(props => <Chat {...props} />);
/*
- Dans Chat component, souscrire à l'event ON_RECEIVE_CHAT_MESSAGE

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
- listen l'event socket ON_RECEIVE_CHAT_MESSAGE (cf dispatcher)
- à la réception du message, maj en bdd + envoi socket aux users avec: 
  - { conversation: '12345', message: 'Coucou', user: '1234' }
*/
