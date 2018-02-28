import React, { Component } from "react";
import { post, get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import FileUpload from "../components/FileUpload";

class SetProfil extends Component {
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

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  handleFileChange = file => {
    this.setState({
      file
    });
  };

  componentDidMount() {
    get("/users/" + this.props.match.params.id).then(userInformations => {
      this.setState({
        sex: userInformations.sex,
        birthDate: userInformations.birthDate,
        city: userInformations.city,
        pseudo: userInformations.pseudo,
        firstName: userInformations.firstName,
        lastName: userInformations.lastName,
        email: userInformations.email,
        file: userInformations.file
      });
    });
  }

  skipEditingProfil = () => {
    this.props.history.push("/profil/" + this.props.match.params.id);
  };

  updateProfil = event => {
    event.preventDefault();
    const userValues = this.state;
    userValues.targetUser = this.props.match.params.id;

    post("/users/editProfil", userValues, userValues.file).then(() => {
      this.props.history.push("/profil/" + this.props.match.params.id);
    });
  };

  render() {
    return (
      <div>
        <h2>Modifier votre profil</h2>
        <form onSubmit={this.updateProfil}>
          <label>
            {" "}
            Prénom
            <input
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange("firstName")}
              type="text"
              placeholder="Prénom"
              required
            />
          </label>
          <label>
            {" "}
            Nom :
            <input
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange("lastName")}
              type="text"
              placeholder="Nom"
              required
            />
          </label>
          <label>
            Pseudo :
            <input
              name="pseudo"
              value={this.state.pseudo}
              onChange={this.handleChange("pseudo")}
              type="text"
              placeholder="Pseudonyme"
              required
            />
          </label>
          <label>
            Email :
            <input
              name="email"
              value={this.state.email}
              onChange={this.handleChange("email")}
              type="email"
              placeholder="Adresse mail"
              required
            />
          </label>
          <label>
            Genre :
            <select
              name="sex"
              value={this.state.sex || ""}
              onChange={this.handleChange("sex")}
            >
              <option value="">--Choisir--</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </label>
          <label>
            Date de naissance :
            <input
              name="birthDate"
              type="date"
              value={this.state.birthDate}
              onChange={this.handleChange("birthDate")}
              placeholder="Date de naissance"
            />
          </label>
          <label>
            Ville :
            <input
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange("city")}
              placeholder="Ville"
            />
          </label>
          <label>
            Photo de profil :
            <FileUpload
              name="file"
              value={this.state.file}
              onChange={this.handleFileChange}
            />
          </label>
          <button type="submit">Valider</button>
        </form>
        <button onClick={this.skipEditingProfil}>Passer</button>
      </div>
    );
  }
}
export default withRouter(props => <SetProfil {...props} />);
