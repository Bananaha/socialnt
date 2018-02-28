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
      <div className="block-center mt-xl wd-xl">
        <div className="panel panel-dark panel-flat">
          <div className="panel-heading text-center">
            <p className="text-center pv">Reinitialisation du mot de passe</p>
          </div>
          <div className="panel-body">
            <form onSubmit={this.submitForm}>
              <p className="text-center">
                Renseigner votre adresse mail pour recevoir un lien de
                réinitialisation.
              </p>
              <div className="form-group has-feedback">
                <label htmlFor="resetInputEmail1" className="text-muted">
                  Adresse email
                </label>

                <input
                  name="email"
                  onChange={this.handleChange("email")}
                  type="email"
                  placeholder="Adresse email"
                  required
                  autoComplete="off"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-danger btn-block">
                Réinitialiser
              </button>
              <button
                type="button"
                className="btn btn-info btn-block"
                onClick={this.goBack}
              >
                Annuler
              </button>
            </form>
            <p>{this.state.alert}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(props => <RequestPasswordForm {...props} />);
