import React, { Component } from 'react';
import 'whatwg-fetch';

class LogInForm extends Component {
  state = {
    pseudo: '',
    password: ''
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
    fetch('/login', {
      method: 'POST',
      body: userValues
    });
  };

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <input
          name="pseudo"
          value={this.state.pseudo}
          onChange={this.handleChange('pseudo')}
          type="text"
          placeholder="Pseudonyme"
          required
        />
        <input
          name="password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          type="password"
          placeholder="Mot de Passe"
          required
        />
        <button type="submit">Valider</button>
      </form>
    );
  }
}

export default LogInForm;
