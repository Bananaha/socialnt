import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Login from './containers/Login';
import Home from './containers/Home';
import SetProfil from './containers/SetProfil';

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
          <Route exact path="/" component={Home} />
          <Route exact path="/setProfil/:pseudo" component={SetProfil} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
