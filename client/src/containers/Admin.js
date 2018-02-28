import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import moment from "moment";
import SearchBar from "../components/SearchBar";
import DeleteButton from "../components/DeleteButton";

import "whatwg-fetch";

class Admin extends Component {
  state = {
    userToDelete: undefined,
    alert: ""
  };

  renderUserToDelete = userToDelete => {
    console.log(userToDelete);
    return (
      <span>
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
    console.log(id, pseudo);
    this.setState({
      userToDelete: { _id: id, pseudo: pseudo },
      disabled: true
    });
  };
  deleteAllMembers = () => {
    post("/users/deleteAll")
      .then(() => {
        this.setState({
          userToDelete: undefined
        });
        this.showInformation(
          "L'ensemble des utilisateurs a été supprimé avec succès",
          "info"
        );
      })
      .catch(() => {
        this.setState({
          userToDelete: undefined
        });
        this.showInformation(
          "Une erreur inattendue à empéché l'execution de votre requête.",
          "warning"
        );
      });
  };
  deleteOneMember = () => {
    console.log(this.state.userToDelete);
    const userToDelete = this.state.userToDelete;
    post("/users/deleteOne", { _id: userToDelete._id })
      .then(() =>
        this.showInformation("L'utilisateur a été supprimé avec succès", "info")
      )
      .catch(() =>
        this.showInformation(
          "Une erreur inattendue à empêché l'execution de votre requête.",
          "warning"
        )
      );
  };
  disableOnSubmit = () => {
    this.setState({
      userToDelete: undefined
    });
    return;
  };
  showInformation = (text, type, action) => {
    // TODO ==> use type argument for style settings
    // info or warning
    this.setState({
      alert: text
    });
    setTimeout(() => {
      this.setState({ alert: "" });
      if (action) {
        action();
      }
    }, 5000);
  };
  render() {
    return (
      <div>
        <h2>Gestion des profils</h2>
        <div>
          <div>
            <h3>Supprimer un utilisateur</h3>
            <div>
              <SearchBar
                onSubmit={this.disableOnSubmit}
                onSelect={this.selectUserToDelete}
                requestPath="/users/search/friends/"
                placeholder="Trouver un utilisateur"
                showButton="false"
                disabled={this.state.disabled ? "disabled" : ""}
              />
              <div>
                {this.state.userToDelete ? (
                  <div>
                    <div>
                      {this.renderUserToDelete(this.state.userToDelete)}
                    </div>

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
              <DeleteButton
                delete={this.deleteAllMembers}
                buttonText="Supprimer tous les membres"
                alertText="Etes vous sûr de vouloir supprimer tous les utilisateurs 'membre' ?"
              />
            </div>
          </div>
        </div>
        {this.state.alert}
      </div>
    );
  }
}
export default withRouter(props => <Admin {...props} />);
