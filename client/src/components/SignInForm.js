import React, { Component } from 'react';
import 'whatwg-fetch';

class SignInForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    pseudo: '',
    email: '',
    emailConfirmation: '',
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
    if (userValues.email === userValues.emailConfirmation) {
      fetch('/signIn', {
        method: 'POST',
        body: userValues
      });
    } else {
      const email = event.target.email;
      const emailConfirmation = event.target.emailConfirmation;
      console.log(email, emailConfirmation);
      // SET BORDER RED WITH WRONG ENTRIES MESSAGE
    }
  };

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <input
          name="firstName"
          value={this.state.firstName}
          onChange={this.handleChange('firstName')}
          type="text"
          placeholder="Prénom"
          required
        />
        <input
          name="lastName"
          value={this.state.lastName}
          onChange={this.handleChange('lastName')}
          type="text"
          placeholder="Nom"
          required
        />
        <input
          name="pseudo"
          value={this.state.pseudo}
          onChange={this.handleChange('pseudo')}
          type="text"
          placeholder="Pseudonyme"
          required
        />
        <input
          name="email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          type="email"
          placeholder="Adresse mail"
          required
        />
        <input
          name="emailConfirmation"
          value={this.state.emailConfirmation}
          onChange={this.handleChange('emailConfirmation')}
          type="text"
          placeholder="Confirmer l'adresse mail'"
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

export default SignInForm;
