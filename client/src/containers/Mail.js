import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import moment from "moment";
import SearchBar from "../components/SearchBar";
import DeleteButton from "../components/DeleteButton";
import "whatwg-fetch";
import styled from "styled-components";

const ConversationList = styled.div`
  border-bottom: 1px solid #ccc;
  font-size: 12px;
`;

const ConversationListContainer = styled.div`
  border: 1px solid black;
  height: 100%;
  width: 30%;
`;

class Mail extends Component {
  state = {
    loading: false,
    conversations: [],
    newRecipients: [],
    editorIsOpen: false,
    alert: undefined,
    newMessage: undefined,
    displayedConversation: undefined,
    pagination: [],
    nbConversation: 0
  };

  computeResult = result => {
    let pages = [];
    for (
      let i = result.nbConversations, nbPages = 1;
      i > 0;
      i -= 10, nbPages++
    ) {
      pages.push(nbPages);
    }
    result.conversations.forEach(conversation => {
      conversation.formattedDate = moment(conversation.lastUpdate).fromNow();
      conversation.messages.forEach(message => {
        message.formattedDate = moment(message.date).fromNow();
      });
    });
    this.setState({
      pagination: pages,
      conversations: result.conversations,
      nbConversation: result.nbConversations,
      loader: false
    });
  };

  updateConversations = (page = 1) => {
    get(`/mail/${page}`)
      .then(this.computeResult)
      .catch(error => {
        this.showInformation(error.alert);
      });
  };

  loadNextPosts = page => event => {
    event.preventDefault();
    this.updateConversations(page);
  };
  // Display notification to user
  showInformation = (text, type) => {
    // TODO ==> use type argument for style settings
    // info or warning
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

    this.setState({ displayedConversation: conversationId });
  };
  // Open or close the message editor
  toogleMessageEditor = () => {
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
  sendMessage = (event, messageType, conversationId) => {
    event.preventDefault();

    // const messageType = event.target.value;
    const messagePayload = {
      text: this.state.newMessage
    };
    if (messageType === "newConversation") {
      const newRecipients = this.state.newRecipients.map(
        newRecipient => (newRecipient = newRecipient._id)
      );
      messagePayload.recipients = newRecipients;
    } else {
      const currentConversation = this.state.conversations.filter(
        conversation => {
          return conversation._id === conversationId;
        }
      );
      messagePayload.recipients = currentConversation[0].recipients;
      messagePayload.conversationId = conversationId;
    }

    post(`/mail/${messageType}`, messagePayload)
      .then(() => {
        this.updateConversations();
        this.showInformation("Message envoyé", "info");
        this.setState({ newMessage: "", newRecipients: [] });
        if (messageType === "newConversation") {
          this.setState({
            editorIsOpen: !this.state.editorIsOpen
          });
        }
      })
      .catch(error => {
        this.showInformation(
          "Le message n'a pas pu être envoyé. Réessayez plus tard.",
          "warning"
        );
      });
  };

  handleMessageEditChange = event => {
    const text = event.target.value;
    this.setState({ newMessage: text });
  };
  // ####################################################
  //
  // -----------------DELETE METHODES____________________
  //
  // ####################################################

  // delete a conversation if the user is the creator
  deleteConversation = (conversationId, ownerId) => {
    const conversationToDelete = {
      conversationId: conversationId,
      ownerId: ownerId
    };
    post("/mail/deleteOneConversation", conversationToDelete)
      .then(() => {
        this.showInformation("Conversation supprimée avec succès", "success");
        this.updateConversations();
      })
      .catch(() => {
        this.showInformation(
          "La conversation n'a pas pu être supprimée. Réessayer plus tard",
          "warning"
        );
      });
  };
  // delete a message if the user is the creator
  deleteMessage = (messageId, autorId, conversationId) => {
    const messageToDelete = {
      messageId: messageId,
      authorId: autorId,
      conversationId: conversationId
    };
    post("/mail/deleteOneMessage", messageToDelete)
      .then(() => {
        this.showInformation("Message supprimé avec succès", "info");
        this.updateConversations();
      })
      .catch(error => {
        this.showInformation(
          "Le message n'a pas pu être supprimé. Réessayez plus tard",
          "warning"
        );
      });
  };

  // ####################################################
  //
  // -----------------RENDER METHODES____________________
  //
  // ####################################################

  // show the recipients choose by the user when he create a new conversation
  // @newRecipient object {_id: string, pseudo: string}
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
  // show the list of all the conversation from whom the user belong(creator or recipient)
  // @conversation object {_id, }
  renderConversationsList = conversation => {
    const { user } = this.props;

    if (!conversation.messages[0] || conversation.messages[0].length === 0) {
      return;
    }
    return (
      <ConversationList key={conversation._id}>
        <div key={conversation.messages[0]._id}>
          <span>
            {conversation.recipients.map(recipient => (
              <span key={recipient.pseudo}>{recipient.pseudo}</span>
            ))}
          </span>
          <p>{conversation.messages[0].text}</p>
          <span>{conversation.formattedDate}</span>
          <div>
            {user && conversation.owner._id === user.id ? (
              <DeleteButton
                delete={(conversationId, ownerId) =>
                  this.deleteConversation(
                    conversation._id,
                    conversation.owner._id
                  )
                }
                buttonText="Supprimer la conversation"
              />
            ) : (
              ""
            )}
          </div>

          <button value={conversation._id} onClick={this.showConversation}>
            Voir
          </button>
        </div>
      </ConversationList>
    );
  };
  // show the conversation choose by the user
  // @conversationId string
  renderChoosenConversation = conversationId => {
    const { user } = this.props;
    const conversation = this.state.conversations.filter(
      conversation => conversation._id === conversationId
    )[0];
    if (!conversation) {
      return;
    }
    return conversation.messages.map(message => {
      console.log("message", message);
      return (
        <div key={message._id}>
          <div>
            <p>from: {message.author.pseudo}</p>
            <div>
              to:{" "}
              {conversation.recipients.map((recipient, index) => {
                if (recipient._id !== message.author._id) {
                  const key = `${recipient._id}_${index}`;

                  return <span key={key}>{recipient.pseudo}</span>;
                }
              })}
              <p>{message.formattedDate}</p>
            </div>
            <div>{message.text}</div>
            {user && message.author._id === user.id ? (
              <DeleteButton
                delete={(messageId, authorId, conversationId) =>
                  this.deleteMessage(
                    message._id,
                    message.author._id,
                    conversation._id
                  )
                }
                buttonText="Supprimer le message"
              />
            ) : (
              ""
            )}
          </div>
        </div>
      );
    });
  };

  // render the text editor for new conversation or new reply
  // @messageType string 'newConversation' or 'newReply'
  // @conversationId string
  renderEditor = (messageType, conversationId) => {
    // set the text area placeholder based on the message type
    let placeholderText;
    if (messageType === "newConversation") {
      placeholderText = "Un jour, une célèbre licorne a dit....";
    } else {
      placeholderText = "Répondre....";
    }
    return (
      <div>
        {/* if the message is a new conversation, show the searchBar and and the recipient list */}
        {messageType === "newConversation" ? (
          <div>
            <SearchBar
              onSubmit={this.addRecipient}
              onSelect={this.addRecipient}
              requestPath="/users/search/friends/"
              placeholder="Ajouter un destinataire"
              showButton="false"
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
          </div>
        ) : (
          ""
        )}
        <form>
          <textarea
            cols="30"
            rows="10"
            placeholder={placeholderText}
            value={this.state.newMessage || ""}
            onInput={this.handleMessageEditChange}
          />
          <button
            type="submit"
            value={messageType}
            onClick={event =>
              this.sendMessage(event, messageType, conversationId)
            }
          >
            Envoyer
          </button>
        </form>
      </div>
    );
  };

  componentDidMount() {
    this.updateConversations();
  }
  render() {
    return (
      <div>
        <h2>Messagerie</h2>
        <button onClick={this.toogleMessageEditor}>
          {this.state.editorIsOpen
            ? "Fermer"
            : "Ouvrir une nouvelle conversation"}
        </button>
        <div>
          {this.state.editorIsOpen ? (
            <div>{this.renderEditor("newConversation")}</div>
          ) : (
            ""
          )}
        </div>
        <ConversationListContainer>
          <h3>Messages reçus</h3>
          {this.state.loading ? (
            <p>Chargement</p>
          ) : (
            <div>
              {this.state.conversations.map(this.renderConversationsList)}
              <div>
                {this.state.pagination.map((page, index) => {
                  return (
                    <button onClick={this.loadNextPosts(page)} key={index}>
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </ConversationListContainer>
        <div>
          {this.state.displayedConversation ? (
            <div>
              {this.renderChoosenConversation(this.state.displayedConversation)}
              {this.renderEditor("newReply", this.state.displayedConversation)}
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
