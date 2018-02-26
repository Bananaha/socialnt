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

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input {
    border: none;
    font-family: "Roboto";
    padding: 8px;
    font-weight: 300;
  }
`;

const LoginBox = styled.div`
  margin: 100px 0;
  position: relative;
  z-index: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  button,
  a {
    margin-left: 14px;
  }
`;

const BottomLinks = `
  transition: opacity .2s ease-out;
  font-size: 13px;
  color: #FFF;
  opacity: 0.8;
  text-decoration: none;

  &:hover,
  &:focus {
    // text-decoration: underline;
    opacity: 1;
  }
`;

const CustomLink = A.withComponent(Link).extend`
  ${BottomLinks}
`;

const CustomButton = A.withComponent("button").extend`
  ${BottomLinks}
`;

const BackgroundImage = styled.div`
  background-image: linear-gradient(45deg, #a749e5 0%, #d520db 100%);
  position: fixed;
  top: -20px;
  right: -20px;
  left: -20px;
  bottom: -20px;

  &::before {
    content: "";
    background-image: url("https://cdn.pixabay.com/photo/2016/10/16/14/49/unicorn-1745330__340.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    filter: blur(20px);
    opacity: 0.3;
    top: -20px;
    right: -20px;
    left: -20px;
    bottom: -20px;
    position: fixed;
  }
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
      <LoginContainer>
        <LoginBox className="Login">
          {this.state.showRegisterForm ? <SignInForm /> : <LogInForm />}
          <ButtonContainer>
            <CustomButton onClick={this.toggleRegisterForm}>
              {this.state.showRegisterForm
                ? "J'ai déja un compte"
                : "S'inscrire"}
            </CustomButton>
            {!this.state.showRegisterForm && (
              <CustomLink to="/resetPassword">Mot de passe oublié ?</CustomLink>
            )}
          </ButtonContainer>
        </LoginBox>
        <IndicatorsBlock />
        <BackgroundImage />
      </LoginContainer>
    );
  }
}
export default Login;
