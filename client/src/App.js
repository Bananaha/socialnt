import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Login from './containers/Login';
import Profil from './containers/Profil';
import SetProfil from './containers/SetProfil';
import ResetPassword from './containers/ResetPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [
        { titre: 'lien1', href: 'www.google.com' },
        { titre: 'lien2', href: 'www.linkedin.com' }
      ]
    };
  }

  render() {
    return (
      <div className="App">
        <Nav links={this.state.links} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/profil/:pseudo" component={Profil} />
          <Route exact path="/setProfil/:pseudo" component={SetProfil} />
          <Route exact path="/resetPassword/" component={ResetPassword} />
          <Route exact path="/resetPassword/:token" component={ResetPassword} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
