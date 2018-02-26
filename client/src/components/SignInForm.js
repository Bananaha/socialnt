import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import { signing } from "../services/user.service";
import "whatwg-fetch";
import { Input, Button, Card } from "../styles/common";
import styled from "styled-components";

const Form = Card.withComponent("form").extend`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;

  input {
    text-align: center;
    
  }
  
  button {
    align-self: flex-end;
  }
`;

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

    if (userValues.email !== userValues.emailConfirmation) {
      return;
    }
    delete userValues.emailConfirmation;
    signing(userValues)
      .then(response => {
        this.props.history.push("/profil/" + response.id);
      })
      .catch(error => {
        console.log("submitForm signin", error);
      });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.submitForm}>
          <Input
            name="firstName"
            onChange={this.handleChange("firstName")}
            type="text"
            placeholder="Prénom"
            required
          />
          <Input
            name="lastName"
            onChange={this.handleChange("lastName")}
            type="text"
            placeholder="Nom"
            required
          />
          <Input
            name="pseudo"
            onChange={this.handleChange("pseudo")}
            type="text"
            placeholder="Pseudonyme"
            required
          />
          <Input
            name="email"
            onChange={this.handleChange("email")}
            type="email"
            placeholder="Adresse mail"
            required
          />
          <Input
            name="emailConfirmation"
            onChange={this.handleChange("emailConfirmation")}
            type="text"
            placeholder="Confirmer l'adresse mail'"
            required
          />
          <Input
            name="password"
            onChange={this.handleChange("password")}
            type="password"
            placeholder="Mot de Passe"
            required
          />
          <Button type="submit">Valider</Button>
        </Form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <SignInForm {...props} />);
