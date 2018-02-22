import React, { Component } from "react";
import { get, del, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "whatwg-fetch";

class Mail extends Component {
  state = {
    loading: true,
    conversations: [
      {
        _id: 4567,
        recipients: ["toto", "tata", "bibi"],
        messages: [
          {
            _id: 123456,
            autor: "bibi",
            date: "01/01/2018",
            text: "Bonjour"
          },
          {
            _id: 123456,
            autor: "toto",
            date: "01/01/2018",
            text: "Hello, ca va ?"
          }
        ]
      },
      {
        _id: 23456,
        recipients: ["toto", "tata", "bibi"],
        messages: [
          {
            _id: 123456,
            autor: "bibi",
            date: "01/01/2018",
            text: "Bonjour"
          },
          {
            _id: 123456,
            autor: "toto",
            date: "01/01/2018",
            text: "Hello, ca va ?"
          }
        ]
      }
    ],
    newRecipients: [],
    newMessage: false,
    alert: undefined,
    newReply: false,
    displayedConversation: undefined
  };

  showInformation = text => {
    this.setState({
      alert: text
    });
    setTimeout(() => {
      this.setState({ alert: "" });
    }, 5000);
  };

  toogleMessageEditor = () => {
    console.log("messageEditor open");
    this.setState({
      newMessage: !this.state.newMessage
    });
  };

  addRecipient = user => {
    console.log("add Recipient");
    const newRecipients = this.state.newRecipients;
    newRecipients.push(user);
    this.setState({
      newRecipients: newRecipients
    });
  };
  removeRecipient = user => {
    console.log("add Recipient");
    const newRecipients = this.state.newRecipients;
    newRecipients.filter(recipientToRemove => user !== recipientToRemove);
    this.setState({
      newRecipients: newRecipients
    });
  };

  sendMessage = (text, autor, recipients) => {
    console.log("sendMessage");
    this.showInformation("Message envoyé");
  };

  deleteConversation = conversationId => {
    console.log("messageRemoved");
    this.showInformation("Message supprimé");
  };
  showConversation = conversationId => {
    console.log("messageRemoved");
    this.setState({ displayedConversation: conversationId });
  };
  renderDisplayedConversation = conversationId => {
    const conversation = this.state.conversations.filter(
      conversation => conversation._id === conversationId
    );
    conversation.messages.map(message => {
      return (
        <div>
          <div>
            <p>from: {message.autor}</p>
            <p>
              to:{" "}
              {message.recipients.map(recipient => {
                <span>recipient.pseudo</span>;
              })}
              <span>{message.date}</span>
            </p>
            <div>{message.text}</div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <h2>Messagerie</h2>
        <button onClick={this.toogleMessageEditor}>Rédiger un message</button>
        <div>
          {this.state.newMessage ? (
            <div>
              <SearchBar
                onSubmit={this.addRecipient}
                onSelect={this.addRecipient}
                requestPath={false}
                placeholder="Ajouter un destinataire"
              />
              <div>
                {this.state.newRecipients.length > 0 ? (
                  <div>
                    {this.state.newRecipients.map(newRecipient => {
                      return (
                        <span>
                          newRecipient.pseudo
                          <button onClick={this.removeRecipient}>
                            supprimer
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </div>

              <form>
                <textarea
                  cols="30"
                  rows="10"
                  placeholder="Un jour, une célèbre licorne a dit...."
                />
                <button type="submit" onClick={this.sendMessage} />
              </form>
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
              {this.state.conversations.map(conversation => {
                return (
                  <div key={conversation._id} onClick={this.showConversation}>
                    return (
                    <div key={conversation[0].message._id}>
                      <span>{conversation[0].message.autor}</span>
                      <span>{conversation[0].message.text}</span>
                      <span>{conversation[0].message.date}</span>
                      <button onClick={this.deleteConversation} />
                    </div>
                    );
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* <div>
        {this.state.displayedConversation ? (
          <div>{this.renderDisplayedConversation}</div>
        ) : (
          ""
        )}
      </div> */}
        <div>{this.state.alert}</div>
      </div>
    );
  }
}
export default withRouter(props => <Mail {...props} />);
