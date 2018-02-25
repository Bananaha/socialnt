import React, { Component } from "react";
import styled from "styled-components";
import SignInForm from "../components/SignInForm";
import LogInForm from "../components/LogInForm";
import IndicatorsBlock from "../components/IndicatorsBlock";
import { emit } from "../sockets";
import TYPES from "../sockets/types";
import { Button, A } from "../styles/common";
import { Link } from "react-router-dom";

// formulaire d'inscription
// mail + mdp + nom + prenom

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin-left: 12px;
  }
`;

const CustomLink = A.withComponent(Link).extend`
  font-size: 12px;
`;

const CustomButton = A.withComponent("button").extend`
  font-size: 12px;
`;

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
      <div>
        <div className="Login">
          {this.state.showRegisterForm ? <SignInForm /> : <LogInForm />}
          <ButtonContainer>
            {!this.state.showRegisterForm && (
              <CustomLink to="/resetPassword">Mot de passe oublié ?</CustomLink>
            )}
            <CustomButton onClick={this.toggleRegisterForm}>
              {this.state.showRegisterForm
                ? "J'ai déja un compte"
                : "S'inscrire"}
            </CustomButton>
          </ButtonContainer>
        </div>
        <IndicatorsBlock />
      </div>
    );
  }
}
export default Login;
