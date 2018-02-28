import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { login } from "../services/user.service";
import "whatwg-fetch";

class LogInForm extends Component {
  state = {
    pseudo: "",
    password: "",
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
    const userValues = this.state;
    delete userValues.alert;
    login(userValues)
      .then(response => {
        this.props.history.push("/profil/" + response.id);
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
            <p className="Login__title">Connexion</p>
          </div>
          <div className="panel-body">
            <form
              role="form"
              data-parsley-validate=""
              noValidate
              className="mb-lg"
              onSubmit={this.submitForm}
            >
              <div className="form-group has-feedback">
                <input
                  autocomplete="off"
                  name="pseudo"
                  onChange={this.handleChange("pseudo")}
                  type="text"
                  placeholder="Pseudonyme"
                  required
                  required="required"
                  className="form-control"
                />
              </div>
              <div className="form-group has-feedback">
                <input
                  autocomplete="off"
                  name="password"
                  onChange={this.handleChange("password")}
                  type="password"
                  placeholder="Mot de Passe"
                  required="required"
                  className="form-control"
                />
                <span className="fa fa-lock form-control-feedback text-muted" />
              </div>

              <button type="submit" className="btn btn-block btn-primary mt-lg">
                Se connecter
              </button>
            </form>
          </div>
          <p className="Login__alert">{this.state.alert}</p>
        </div>
      </div>
    );
  }
}
export default withRouter(props => <LogInForm {...props} />);
