import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import openSocket from "socket.io-client";

import "./App.css";
import Nav from "./components/Nav";
import Login from "./containers/Login";
import Profil from "./containers/Profil";
import SetProfil from "./containers/SetProfil";
import ResetPassword from "./containers/ResetPassword";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [
        { titre: "Profil", href: "www.google.com" },
        { titre: "Deconnexion", href: "www.linkedin.com" }
      ]
    };
    const socket = openSocket("http://localhost:5000");
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
