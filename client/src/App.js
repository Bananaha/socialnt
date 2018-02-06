import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "./App.css";
import Nav from "./components/Nav";
import Login from "./containers/Login";
import Profil from "./containers/Profil";
import SetProfil from "./containers/SetProfil";
import ResetPassword from "./containers/ResetPassword";
import UsersList from "./containers/UsersList";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [
        { titre: "Profil", href: "www.google.com" },
        { titre: "Deconnexion", href: "www.linkedin.com" }
      ]
    };
  }

  render() {
    return (
      <div>
        <Nav links={this.state.links} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/profil/:id" component={Profil} />
          <Route exact path="/setProfil/:id" component={SetProfil} />
          <Route exact path="/resetPassword/" component={ResetPassword} />
          <Route exact path="/resetPassword/:token" component={ResetPassword} />
          <Route exact path="/search/:query" component={UsersList} />
          <Redirect to="/login" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
