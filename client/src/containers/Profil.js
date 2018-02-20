import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import DeleteButton from "../components/DeleteButton";
import PostsList from "../components/PostsList";
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
    loader: true
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.fetchProfil(nextProps.match.params.id);
    }
  }

  componentDidMount() {
    this.fetchProfil(this.props.match.params.id);
  }

  fetchProfil = profileId => {
    this.setState({
      loader: true
    });
    get(`/users/${profileId}`)
      .then(userInformations => {
        this.setState({
          sex: userInformations.sex,
          birthDate: userInformations.birthDate,
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          avatar: userInformations.avatar,
          loader: false
        });
      })
      .catch(error => {
        this.setState({
          loader: false
        });
        console.log("ERROR", error);
        this.props.history.goBack();
      });
  };

  editProfil = () => {
    this.props.history.push("/setProfil/" + this.props.match.params.id);
  };

  deleteProfil = () => {
    console.log("deleteProfil");
    del("/users")
      .then(() => {
        localStorage.removeItem("token");
        this.props.history.push("/login");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const isCurrentUser =
      this.props.user && this.props.match.params.id === this.props.user.id;
    return (
      <div className="Home">
        {this.state.loader ? (
          <p>Loading...</p>
        ) : (
          <div>
            <img
              style={{ width: 200 + "px", height: "auto" }}
              src={process.env.REACT_APP_HOST + "/images/" + this.state.avatar}
              alt="avatar"
            />
            <p>{this.state.pseudo}</p>
            <p>
              {this.state.firstName} {this.state.lastName}
            </p>
            <p>
              {this.state.birthDate} {this.state.sex}
            </p>
            <p>{this.state.city}</p>
            {isCurrentUser && (
              <div>
                <button onClick={this.editProfil}>Editer mon profile</button>
                <DeleteButton
                  delete={this.deleteProfil}
                  text="Supprimer le profil"
                />
              </div>
            )}
            <PostsList />
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
