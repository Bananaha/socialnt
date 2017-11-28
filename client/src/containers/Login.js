import React, { Component } from 'react';

import SignInForm from '../components/SignInForm';
import LogInForm from '../components/LogInForm';
// formulaire d'inscription
// mail + mdp + nom + prenom
class Login extends Component {
  state = {
    showRegisterForm: false
  };

  toggleRegisterForm = () => {
    this.setState({
      showRegisterForm: !this.state.showRegisterForm
    });
  };

  render() {
    return (
      <div className="Login">
        {this.state.showRegisterForm ? <SignInForm /> : <LogInForm />}
        <button onClick={this.toggleRegisterForm}>
          {this.state.showRegisterForm ? 'Se connecter' : "S'inscrire"}
        </button>
      </div>
    );
  }
}
export default Login;
