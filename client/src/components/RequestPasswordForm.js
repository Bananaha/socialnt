import React, { Component } from 'react';
import { post } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class RequestPasswordForm extends Component {
  state = {
    email: ''
  }

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitForm = event => {
    event.preventDefault();
    post('/users/reset/', {email: this.state.email}).then((result) => {
      this.props.onChange()
    })
      .catch((error) => {
        console.log(error)
      })
  };

  render() {
    console.log(this.props)
    return (
      <form onSubmit={this.submitForm}>
        <input
          name="email"
          onChange={this.handleChange("email")}
          type="email"
          placeholder="Adresse email"
          required
        />
        <button type="submit">Valider</button>
      </form>
    )
  }
}

export default withRouter(props => <RequestPasswordForm {...props} />);

