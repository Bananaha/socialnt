import React, { Component } from "react";
import SignInForm from "../components/SignInForm";
import LogInForm from "../components/LogInForm";
import IndicatorsBlock from "../components/IndicatorsBlock";
import { emit } from "../sockets";
import TYPES from "../sockets/types";
import { Link } from "react-router-dom";
import "../styles/Login.css";

class Login extends Component {
  state = {
    showRegisterForm: false
  };

  toggleRegisterForm = () => {
    this.setState({
      showRegisterForm: !this.state.showRegisterForm
    });
  };

  componentDidMount = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    emit(TYPES.USER_INFO);
  };

  render() {
    return (
      <div className="Login">
        <div className="Login__box">
          {this.state.showRegisterForm ? <SignInForm /> : <LogInForm />}
          <div className="Login__button-container">
            <button
              className="Login__bottom-links"
              onClick={this.toggleRegisterForm}
            >
              {this.state.showRegisterForm
                ? "J'ai déja un compte"
                : "S'inscrire"}
            </button>
            {!this.state.showRegisterForm && (
              <Link className="Login__bottom-links" to="/resetPassword">
                Mot de passe oublié ?
              </Link>
            )}
          </div>
        </div>
        <IndicatorsBlock />
      </div>
    );
  }
}
export default Login;
