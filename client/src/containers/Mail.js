import React, { Component } from "react";
import { get, del, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "whatwg-fetch";

class Mail extends Component {
  state = {
    loading: false,
    conversations: [
      {
        _id: 4567,
        owner: 1245676878708976,
        recipients: [
          { _id: 132437, pseudo: "toto" },
          { _id: 132437, pseudo: "tata" },
          { _id: 132437, pseudo: "titi" }
        ],
        messages: [
          {
            _id: "message1",
            autor: "bibi",
            date: "01/01/2018",
            text: "Bonjour"
          },
          {
            _id: "message2",
            autor: "toto",
            date: "01/01/2018",
            text: "Hello, ca va ?"
          }
        ]
      },
      {
        _id: 23456,
        owner: 253748595324,
        recipients: [
          { _id: 132437, pseudo: "toto" },
          { _id: 132437, pseudo: "tata" },
          { _id: 132437, pseudo: "titi" }
        ],
        messages: [
          {
            _id: "message1",
            autor: "bibi",
            date: "01/01/2018",
            text: "Bonjour"
          },
          {
            _id: "message2",
            autor: "toto",
            date: "01/01/2018",
            text: "Hello, ca va ?"
          }
        ]
      }
    ],
    newRecipients: [],
    editorIsOpen: false,
    alert: undefined,
    newReply: undefined,
    newMessage: undefined,
    displayedConversation: undefined
  };

  // Display notification to user
  showInformation = text => {
    this.setState({
      alert: text
    });
    setTimeout(() => {
      this.setState({ alert: "" });
    }, 5000);
  };

  // show a choosen conversation
  showConversation = event => {
    event.preventDefault();
    const conversationId = event.target.value;
    console.log("Messages show", event, event.target);

    this.setState({ displayedConversation: conversationId });
  };
  // Open or close the message editor
  toogleMessageEditor = () => {
    console.log("messageEditor open");
    this.setState({
      editorIsOpen: !this.state.editorIsOpen
    });
  };
  // Add a new recipient to a message
  addRecipient = (id, pseudo) => {
    const newRecipients = this.state.newRecipients;
    newRecipients.push({ _id: id, pseudo: pseudo });
    this.setState({
      newRecipients: newRecipients
    });
  };
  // remove a recipient from a message
  removeRecipient = recipientId => {
    this.setState({
      newRecipients: this.state.newRecipients.filter(
        recipientToRemove => recipientId !== recipientToRemove._id
      )
    });
  };
  // Send the message
  sendMessage = event => {
    event.preventDefault();
    const messageType = event.target.value;
    const messagePayload = {
      text: this.state.newMessage,
      recipients: this.state.newRecipients
    };
    // post("//messageType", messagePayload);
    console.log(messagePayload, event.target.value);
    this.showInformation("Message envoyé");
  };
  // delete a conversation if the user is the creator
  deleteConversation = conversationId => {
    console.log("messageRemoved");
    this.showInformation("Message supprimé");
  };
  // delete a message if the user is the creator
  deleteMessage = event => {
    console.log("deleteMessage", event.target.value);
  };

  renderRecipientsList = newRecipient => {
    return (
      <span key={newRecipient._id}>
        {newRecipient.pseudo}
        <button onClick={id => this.removeRecipient(newRecipient._id)}>
          supprimer
        </button>
      </span>
    );
  };

  renderConversationsList = conversation => {
    return (
      <div key={conversation._id}>
        <div key={conversation.messages[0]._id}>
          <span>{conversation.messages[0].autor}</span>
          <span>{conversation.messages[0].text}</span>
          <span>{conversation.messages[0].date}</span>
          <button onClick={this.deleteConversation}>Supprimer</button>
          <button value={conversation._id} onClick={this.showConversation}>
            Voir
          </button>
        </div>
      </div>
    );
  };

  renderChoosenConversation = conversationId => {
    const conversation = this.state.conversations.filter(
      conversation => parseInt(conversation._id) === parseInt(conversationId)
    )[0];
    return conversation.messages.map(message => {
      return (
        <div key={message._id}>
          <div>
            <p>from: {message.autor}</p>
            <div>
              to:{" "}
              {conversation.recipients.map((recipient, index) => {
                const key = `${recipient._id}_${index}`;
                return <span key={key}>{recipient.pseudo}</span>;
              })}
              <p>{message.date}</p>
            </div>
            <div>{message.text}</div>
            <button value={message._id} onClick={this.deleteMessage}>
              Supprimer
            </button>
          </div>
        </div>
      );
    });
  };

  renderEditor = messageType => {
    return (
      <form>
        <textarea
          cols="30"
          rows="10"
          placeholder="Un jour, une célèbre licorne a dit...."
          onInput={this.handleMessageEditChange}
        />
        <button type="submit" value={messageType} onClick={this.sendMessage}>
          Envoyer
        </button>
      </form>
    );
  };

  handleMessageEditChange = event => {
    const text = event.target.value;
    this.setState({ newMessage: text });
  };

  render() {
    return (
      <div>
        <h2>Messagerie</h2>
        <button onClick={this.toogleMessageEditor}>Rédiger un message</button>
        <div>
          {this.state.editorIsOpen ? (
            <div>
              <SearchBar
                onSubmit={this.addRecipient}
                onSelect={this.addRecipient}
                requestPath="/users/search/friends/"
                placeholder="Ajouter un destinataire"
              />
              <div>
                {this.state.newRecipients.length > 0 ? (
                  <div>
                    {this.state.newRecipients.map(this.renderRecipientsList)}
                  </div>
                ) : (
                  "Choisissez un ou plusieurs destinataires"
                )}
              </div>

              {this.renderEditor("newMessage")}
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <h3>Messages reçus</h3>
          {this.state.loading ? (
            <p>Chargement</p>
          ) : (
            <div>
              {this.state.conversations.map(this.renderConversationsList)}
            </div>
          )}
        </div>
        <div>
          {this.state.displayedConversation ? (
            <div>
              {this.renderChoosenConversation(this.state.displayedConversation)}
            </div>
          ) : (
            "empty state"
          )}
        </div>
        <div>{this.state.alert}</div>
      </div>
    );
  }
}
export default withRouter(props => <Mail {...props} />);
