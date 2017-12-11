import React, { Component } from 'react';
import { post, get } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

import FileUpload from '../components/FileUpload';

class SetProfil extends Component {
  state = {
    sex: '',
    birthDate: '',
    city: '',
    pseudo: '',
    firstName: '',
    lastName: '',
    email: '',
    photo: ''
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  componentDidMount() {
    get('/users/' + this.props.match.params.pseudo)
      .then(userInformations => {
        console.log(userInformations);
        this.setState({
          sex: userInformations.sex,
          birthDate: userInformations.birthDate,
          city: userInformations.city,
          pseudo: userInformations.pseudo,
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          email: userInformations.email,
          photo: userInformations.photo
        });
      })
      .catch(error => {
        console.log(error);
        this.props.history.push('/');
      });
  }

  skipEditingProfil = () => {
    this.props.history.push('/');
  };

  updateProfil = () => {
    const userValues = this.state;
    post('/users/editProfil', userValues)
      .then(() => {
        console.log('profilUpdate');
        this.props.history.push('/');
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <p>
          Bienvenue {this.props.match.params.pseudo}, Avant de commencer,
          renseigner votre profil afin que les autres membres puissent mieux
          vous connaître.
        </p>
        <form onSubmit={this.updateProfil}>
          <label>
            {' '}
            Prénom
            <input
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange('firstName')}
              type="text"
              placeholder="Prénom"
              required
            />
          </label>
          <label>
            {' '}
            Nom :
            <input
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
              type="text"
              placeholder="Nom"
              required
            />
          </label>
          <label>
            Pseudo :
            <input
              name="pseudo"
              value={this.state.pseudo}
              onChange={this.handleChange('pseudo')}
              type="text"
              placeholder="Pseudonyme"
              required
            />
          </label>
          <label>
            Email :
            <input
              name="email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              type="email"
              placeholder="Adresse mail"
              required
            />
          </label>
          <label>
            Genre :
            <select
              name="sex"
              value={this.state.sex}
              onChange={this.handleChange('sex')}
            >
              <option value="choice">--Choisir--</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </label>
          <label>
            Date de naissance :
            <input
              name="birthDate"
              type="date"
              value={this.state.birthDate}
              onChange={this.handleChange('birthDate')}
              placeholder="Date de naissance"
            />
          </label>
          <label>
            Ville :
            <input
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange('city')}
              placeholder="Ville"
            />
          </label>
          <label>
            Photo de profil :
            <FileUpload
              name="photo"
              value={this.state.photo}
              onChange={this.handleChange('photo')}
            />
          </label>
          <button type="submit">Valider</button>
        </form>
        <button onClick={this.skipEditingProfil}>Passer</button>
      </div>
    );
  }
}
export default withRouter(props => <SetProfil {...props} />);
