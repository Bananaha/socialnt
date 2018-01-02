import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class RequestPasswordForm extends Component {
  state = {
    email: "",
    alert: ""
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    post("/users/reset/", { email: this.state.email })
      .then(result => {
        this.setState({
          message:
            "Un lien de réinitialisation de mot de passe vient d'être envoyé à " +
            this.state.email
        });
      })
      .catch(error => {
        this.setState({ alert: error.alert });
      });
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            name="email"
            onChange={this.handleChange("email")}
            type="email"
            placeholder="Adresse email"
            required
          />
          <button type="submit">Valider</button>
        </form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <RequestPasswordForm {...props} />);
