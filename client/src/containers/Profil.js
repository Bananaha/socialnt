import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import MessagesList from "../components/MessagesList";
class Profil extends Component {
  state = {
    sex: "",
    birthDate: "",
    city: "",
    pseudo: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: ""
  };

  componentDidMount() {
    console.log(this.props.match.params.id);
    get("/users/" + this.props.match.params.id)
      .then(userInformations => {
        console.log("response", userInformations);
        this.setState({
          sex: userInformations.sex,
          birthDate: userInformations.birthDate,
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName
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

  render() {
    return (
      <div className="Home">
        <h1>Home</h1>
        <div>
          <img
            src={"../../../server/Avatars/" + this.state.avatar}
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
          <button onClick={this.editProfil}>Editer mon profil</button>
          <MessagesList />
        </div>

        <p />
      </div>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
