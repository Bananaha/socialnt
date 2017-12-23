import React, { Component } from 'react';
import { post } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class ChangePasswordForm extends Component {
  state = {
    password: '',
    confirmedPassword: '',
    message: ''
  }
  
  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    if (this.state.password === this.state.confirmedPassword ) {
      post('/users/reset/', this.props.match.params).then((result) => {
      })
        .catch((error) => {
          this.setState({
            message: 'Votre mot de passe n\'a pas pu être mis à jour. Contactez un admin.'
          })
        })
    } else {
      this.setState({
        message: 'les mots de passe saisie ne sont pas identiques'
      })
    }
  };


  render() {
    console.log(this.state.message)
    console.log(this.state)
    return (
      <form onSubmit={this.submitForm}>
        <input
          name="password"
          onChange={this.handleChange('password')}
          type="password"
          placeholder="Nouveau mot de passe"
          required
        />
        <input
          name="confirmedPassword"
          onChange={this.handleChange('confirmedPassword')}
          type="password"
          placeholder="Confirmer votre nouveau mot de passe"
          required
        />
        <p>{this.state.message}</p>
        <button type="submit">Modifier mon mot de passe</button>
        <button>Annuler</button>

      </form>
    )
  }
}

export default withRouter(props => <ChangePasswordForm {...props} />);