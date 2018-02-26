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

  goBack = () => {
    this.props.history.push("/login");
  };

  submitForm = event => {
    event.preventDefault();
    post("/users/reset/", { email: this.state.email })
      .then(result => {
        this.setState({
          alert:
            "Un lien de réinitialisation de mot de passe vient d'être envoyé à " +
            this.state.email
        });
        this.timeout = setTimeout(() => {
          this.setState({ alert: "" });
          this.props.history.push("/login");
        }, 5000);
      })
      .catch(error => {
        this.setState({ alert: error.alert });
      });
  };

  render() {
    return (
      <div>
        <button type="button" onClick={this.goBack}>
          Retour
        </button>
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
