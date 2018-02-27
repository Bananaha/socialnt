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

class Admin extends Component {
  state = {
    showUserManager: false,
    showMailManager: false,
    userToDelete: undefined
  };

  renderUserManager = () => {
    return (
      <div>
        <h2>Gestion des profils</h2>
        <div>
          Supprimer un utilisateur
          <div>
            <SearchBar
              onSelect={this.selectUserToDelete}
              requestPath="/users/search/friends/"
              placeholder="Trouver un utilisateur"
              showButton="false"
              disabled={this.state.disabled ? "disabled" : ""}
            />
            <div>
              {this.state.userToDelete ? (
                <div>
                  <div>{this.renderUserToDelete}</div>

                  <DeleteButton
                    delete={this.deleteOneMember}
                    buttonText="Supprimer l'utilisateur"
                    alertText="Etes vous sûr de vouloir supprimer cet utilisateur ?"
                  />
                </div>
              ) : (
                "Choisissez un utilisateur à supprimer"
              )}
            </div>
          </div>
        </div>
        <div>
          <DeleteButton
            delete={this.deleteAllMembers}
            buttonText="Supprimer tous les membres"
            alertText="Etes vous sûr de vouloir supprimer tous les utilisateurs 'membre' ?"
          />
        </div>
      </div>
    );
  };

  renderUserToDelete = userToDelete => {
    return (
      <span key={userToDelete._id}>
        {userToDelete.pseudo}
        <button onClick={id => this.removeUserToDelete(userToDelete._id)}>
          X
        </button>
      </span>
    );
  };

  removeUserToDelete = userToDelete => {
    this.setState({
      userToDelete: undefined,
      disabled: false
    });
  };

  selectUserToDelete = (id, pseudo) => {
    this.setState({
      userToDelete: { _id: id, pseudo: pseudo },
      disabled: true
    });
  };

  showUserManager = () => {
    this.setState({
      showUserManager: !this.state.showUserManager
    });
  };

  deleteAllMembers = () => {
    console.log("deleteAll");
  };

  deleteOneMember = () => {
    console.log(this.state.userToDelete);
  };
  showMailManager = () => {
    this.setState({
      showMailManager: !this.state.showMailManager
    });
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        <h1>Dashboard</h1>
        <ul>
          <li onClick={this.showUserManager}>Profils</li>
          <li onClick={this.showMailManager}>Discussions</li>
        </ul>
        {this.state.showUserManager ? (
          <div>{this.renderUserManager()}</div>
        ) : (
          ""
        )}
        {this.state.showMailManager ? (
          <div>{this.renderMailManager()}</div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default withRouter(props => <Admin {...props} />);
