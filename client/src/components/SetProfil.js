import React, { Component } from 'react';
import { post, get } from '../services/request.service';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

class SetProfil extends Component {
  componentDidMount() {
    // get('/getUserInformations').then(userInformations => {});
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <p>
          Bienvenue {this.props.match.params.pseudo}, Avant de commencer,
          renseigner votre profil afin que les autres membres puissent mieux
          vous connaître.
        </p>
        <form>
          <select name="sexe">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
          <label htmlFor="" />
          <input name="" type="date" placeholder="Date de naissance" />
          <input name="" type="text" placeholder="Ville" />
          <input name="" type="file" name="" id="" />
        </form>
      </div>
    );
  }
}
export default withRouter(props => <SetProfil {...props} />);
