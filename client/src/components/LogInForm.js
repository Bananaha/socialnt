import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { login } from "../services/user.service";
import "whatwg-fetch";
import { Input, Button, Card } from "../styles/common";
import { BORDER_COLOR } from "../styles/variables";
import styled from "styled-components";

const Form = Card.withComponent("form").extend`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;

  input {
    text-align: center;
    
  }
  
  button {
    align-self: flex-end;
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
        this.props.history.push("/profile/" + response.id);
      })
      .catch(error => {
        this.setState({ alert: error.alert });
      });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.submitForm}>
          <Input
            name="pseudo"
            onChange={this.handleChange("pseudo")}
            type="text"
            placeholder="Pseudonyme"
            required
          />
          <Input
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
