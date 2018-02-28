import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import moment from "moment";
import "moment/locale/fr";

import DeleteButton from "../components/DeleteButton";
import PostsList from "../components/PostsList";
import FriendsList from "../components/FriendsList";
import "../styles/Profil.css";

class Profil extends Component {
  state = {
    sex: "",
    birthDate: "",
    city: "",
    pseudo: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    loading: true
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.fetchProfil(nextProps.match.params.id);
    }
  }

  componentDidMount() {
    this.fetchProfil(this.props.match.params.id);
  }

  showInformation = (text, type, action) => {
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

  fetchProfil = profilId => {
    this.setState({
      loading: true
    });
    get(`/users/${profilId}`)
      .then(userInformations => {
        this.setState({
          sex: userInformations.sex,
          birthDate: moment(userInformations.birthDate).format("DD/MM/YYYY"),
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          avatar: userInformations.avatar,
          loading: false,
          alert: ""
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        this.props.history.push(`/profil/${this.props.match.params.id}`);
      });
  };

  editProfil = () => {
    this.props.history.push("/setProfil/" + this.props.match.params.id);
  };

  deleteProfil = () => {
    post("/users/deleteOne", { _id: this.props.match.params.id }).then(() => {
      if (
        this.props.user.profile === "admin" &&
        this.props.match.params.id !== this.props.user.id
      ) {
        this.showInformation("L'utilisateur a été supprimé", "info", () =>
          this.props.history.push(`/profil/${this.props.user.id}`)
        );
      } else {
        localStorage.removeItem("token");
        this.showInformation(
          "Votre profil a été supprimé. A bientôt",
          "info",
          () => this.props.history.push("/login")
        );
      }
    });
  };

  render() {
    const isCurrentUserOrAdmin =
      (this.props.user && this.props.match.params.id === this.props.user.id) ||
      (this.props.user && this.props.user.profile === "admin");

    return (
      <div className="Home page-body">
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex-extend">
            <div className="card Profil__header-card">
              <img
                style={{ width: 200 + "px", height: "auto" }}
                src={`${process.env.REACT_APP_HOST}/images/${
                  this.state.avatar
                }`}
                alt="avatar"
              />
              <div className="Profil__header">
                <div>
                  <div className="Profil__pseudo">
                    <b>{this.state.pseudo}</b>
                    <span>
                      ({this.state.firstName} {this.state.lastName})
                    </span>
                  </div>
                  <div className="Profil__user-details">
                    {this.state.birthDate && (
                      <span>{this.state.birthDate}</span>
                    )}
                    {this.state.sex && <span>{this.state.sex}</span>}
                    {this.state.city && <span>{this.state.city}</span>}
                  </div>
                </div>
                {isCurrentUserOrAdmin && (
                  <div className="Profil__actions">
                    <DeleteButton
                      delete={this.deleteProfil}
                      buttonText="Supprimer le profil"
                      alertText="Etes vous de vouloir supprimer votre profil ?"
                    />
                    <button className="button--small" onClick={this.editProfil}>
                      Editer mon profil
                    </button>
                  </div>
                )}
              </div>
            </div>
            <PostsList />
            <FriendsList user={this.props.user} />
          </div>
        )}
        {this.state.alert}
      </div>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
