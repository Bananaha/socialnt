import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class SignInForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    pseudo: "",
    email: "",
    emailConfirmation: "",
    password: ""
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    const userValues = this.state;

    if (userValues.email === userValues.emailConfirmation) {
      delete userValues.emailConfirmation;
      post("/login/newUser", userValues)
        .then(response => {
          localStorage.setItem("token", response.token);
          this.setState({
            alert: response.alert
          });
          setTimeout(() => {
            this.setState({
              alert: ""
            });
            this.props.history.push("/login");
            // this.props.history.push("/setProfil/" + response.pseudo);
          }, 5000);
        })
        .catch(error => {
          console.log("submitForm signin", error);
        });
    } else {
      const email = event.target.email;
      const emailConfirmation = event.target.emailConfirmation;
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            name="firstName"
            onChange={this.handleChange("firstName")}
            type="text"
            placeholder="Prénom"
            required
          />
          <input
            name="lastName"
            onChange={this.handleChange("lastName")}
            type="text"
            placeholder="Nom"
            required
          />
          <input
            name="pseudo"
            onChange={this.handleChange("pseudo")}
            type="text"
            placeholder="Pseudonyme"
            required
          />
          <input
            name="email"
            onChange={this.handleChange("email")}
            type="email"
            placeholder="Adresse mail"
            required
          />
          <input
            name="emailConfirmation"
            onChange={this.handleChange("emailConfirmation")}
            type="text"
            placeholder="Confirmer l'adresse mail'"
            required
          />
          <input
            name="password"
            onChange={this.handleChange("password")}
            type="password"
            placeholder="Mot de Passe"
            required
          />
          <button type="submit">Valider</button>
        </form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <SignInForm {...props} />);
