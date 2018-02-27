import React, { Component } from "react";
import { post, get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class ChangePasswordForm extends Component {
  state = {
    password: "",
    confirmedPassword: "",
    alert: "",
    url: encodeURIComponent(process.env.REACT_CLIENT_URL + this.props.match.url)
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    if (this.state.password === this.state.confirmedPassword) {
      const userData = {
        url: this.state.url,
        password: this.state.password
      };

      post("/users/newPassword/", userData)
        .then(result => {
          this.setState({
            alert: "Votre mot de passe a été mis à jour"
          });
          setTimeout(() => {
            this.props.history.push("/login");
          }, 5000);
        })
        .catch(error => {
          this.setState({
            alert:
              "Votre mot de passe n'a pas pu être mis à jour. Contactez un admin."
          });
          setTimeout(() => {
            this.setState({
              alert: ""
            });
          }, 5000);
        });
    } else {
      this.setState({
        alert: "les mots de passe saisie ne sont pas identiques"
      });
      setTimeout(() => {
        this.setState({
          alert: ""
        });
      }, 5000);
    }
  };

  componentDidMount() {
    get("/users/reset/" + this.state.url)
      .then(result => {
        this.setState({
          alert: result
        });
      })
      .catch(error => {
        this.setState({
          alert: error.message
        });
        setTimeout(() => {
          this.props.history.push("/login");
        }, 5000);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            name="password"
            onChange={this.handleChange("password")}
            type="password"
            placeholder="Nouveau mot de passe"
            required
          />
          <input
            name="confirmedPassword"
            onChange={this.handleChange("confirmedPassword")}
            type="password"
            placeholder="Confirmer votre nouveau mot de passe"
            required
          />
          <button type="submit">Modifier mon mot de passe</button>
          <button>Annuler</button>
        </form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <ChangePasswordForm {...props} />);
