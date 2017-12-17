import React, { Component } from 'react';
import { get } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class Profil extends Component {
  state = {
    sex: '',
    birthDate: '',
    city: '',
    pseudo: '',
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
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
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  editProfil = () => {
    this.props.history.push('/setProfil/' + this.state.pseudo);
  }

  render() {
    return (
      <div className="Home">
        <h1>Home</h1>
        <div>
          <img src={this.state.avatar} alt="avatar" />
          <p>{this.state.pseudo}</p>
          <p>{this.state.firstName} {this.state.lastName}</p>
          <p>{this.state.birthDate} {this.state.sex} </p>
          <p>{this.state.city}</p>
          <button onClick={this.editProfil}>Editer mon profil</button>
        </div>

        <p></p>

      </div>
    );
  }
}
export default withRouter(props => <Profil {...props} />);
