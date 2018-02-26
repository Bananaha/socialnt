import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { login } from "../services/user.service";
import "whatwg-fetch";
import { Input, Button, Card } from "../styles/common";
import styled from "styled-components";
import { COLOR_PINK_LIGHT } from "../styles/variables";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  max-width: 100%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 3px;
  box-shadow: 1px 1px 6px rgba(50, 50, 0, 0.1);

  input {
    text-align: center;

    &:-webkit-autofill {
      background-color: white !important;
    }
    /* margin-bottom: 12px; */

    &::placeholder {
      font-size: 12px;
    }

    &:first-child {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      margin-bottom: 0;
      border-bottom: 1px solid #eee;
    }

    &:not(:first-child) {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  button {
    margin-top: 20px;
    /* width: 100%; */
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 3px;
    background-color: transparent;
    color: #eee;
    font-weight: 500;

    &:hover,
    &:focus {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

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
        console.log(error);
        this.setState({ alert: error.alert });
      });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.submitForm}>
          <Input
            autocomplete="off"
            name="pseudo"
            onChange={this.handleChange("pseudo")}
            type="text"
            placeholder="Pseudonyme"
            required
          />
          <Input
            autocomplete="off"
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
export default withRouter(props => <LogInForm {...props} />);
