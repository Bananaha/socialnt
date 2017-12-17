import React, { Component } from 'react';
import { get, post } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class LogInForm extends Component {
  state = {
    email: '',
    message: ''
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    get('/users/reset/' + this.state.email).then((result) => {
      console.log(result)
    })
      .catch((error) => {
        console.log(error)
      })

    // post('/resetPassword', this.state.email)
    //   .then(response => {
    //     this.setState({
    //       message: 'un mail de réinitialisation de mot de passe vient d\'être envoyé'
    //     })
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({
    //       message: 'Le mail de réinitialisation de mot de passe n\'a pas pu être envoyé.'
    //     })
    //   });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            name="email"
            onChange={this.handleChange('email')}
            type="email"
            placeholder="Adresse email"
            required
          />
          <button type="submit">Valider</button>
        </form>
      </div>

    );
  }
}
export default withRouter(props => <LogInForm {...props} />);
