import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { post } from "../services/request.service";
import { signing } from "../services/user.service";
import "whatwg-fetch";

import { Grid, Row, Col, Panel, Button } from "react-bootstrap";
import { Router, Route, Link, History, withRouter } from "react-router-dom";

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
      this.setState({
        alert: "Les adresses mail saisies ne sont pas identiques"
      });
      this.timeout = setTimeout(() => {
        this.setState({ alert: "" });
      }, 5000);
    } else {
      signing(userValues)
        .then(response => {
          this.props.history.push("/profil/" + response.id);
        })
        .catch(error => {
          this.setState({ alert: error.alert });
          this.timeout = setTimeout(() => {
            this.setState({ alert: "" });
          }, 5000);
        });
    }
  };

  render() {
    return (
      <div className="Login__inner--big">
        <div className="block-center mt-xl wd-xl">
          <div className="panel panel-dark panel-flat">
            <div className="panel-heading text-center">
              <p className="text-center pv Login__title">Inscription</p>
            </div>
            <div className="panel-body">
              <form onSubmit={this.submitForm}>
                <div className="form-group has-feedback">
                  <label className="text-muted">Prénom</label>
                  <input
                    name="firstName"
                    onChange={this.handleChange("firstName")}
                    type="text"
                    placeholder="Prénom"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <div className="form-group has-feedback">
                  <label className="text-muted">Nom</label>
                  <input
                    name="lastName"
                    onChange={this.handleChange("lastName")}
                    type="text"
                    placeholder="Nom"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <div className="form-group has-feedback">
                  <label className="text-muted">Pseudo</label>
                  <input
                    name="pseudo"
                    onChange={this.handleChange("pseudo")}
                    type="text"
                    placeholder="Pseudonyme"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <div className="form-group has-feedback">
                  <label className="text-muted">Adresse mail</label>
                  <input
                    name="email"
                    onChange={this.handleChange("email")}
                    type="email"
                    placeholder="Adresse mail"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <div className="form-group has-feedback">
                  <label className="text-muted">Confirmer l'adresse mail</label>
                  <input
                    name="emailConfirmation"
                    onChange={this.handleChange("emailConfirmation")}
                    type="text"
                    placeholder="Confirmer l'adresse mail"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <div className="form-group has-feedback">
                  <label className="text-muted">Mot de passe</label>
                  <input
                    name="password"
                    onChange={this.handleChange("password")}
                    type="password"
                    placeholder="Mot de Passe"
                    autoComplete="off"
                    required="required"
                    className="form-control"
                  />
                </div>
                <Button
                  type="submit"
                  className="btn btn-block btn-primary mt-lg"
                >
                  Créer un compte
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div>
          <p className="Login__alert text-center pv">{this.state.alert}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(props => <SignInForm {...props} />);
