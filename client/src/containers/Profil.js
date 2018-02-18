import React, { Component } from "react";
import { get } from "../services/request.service";
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

  componentDidMount() {
    get(`/users/${this.props.match.params.id}`)
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
        console.log("ERROR", error);
        this.props.history.goBack();
      });
  }

  editProfil = () => {
    this.props.history.push("/setProfil/" + this.props.match.params.id);
  };

  deleteProfil = event => {
    event.preventDefault();
    console.log("delete");
  };

  render() {
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
            <button onClick={this.editProfil}>Editer mon profile</button>
            <DeleteButton
              onClick={this.deleteProfil}
              text="Supprimer le profil"
            />
            <PostsList />
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
