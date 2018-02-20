import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect, subscribe } from "./sockets";

import "./App.css";
import Nav from "./components/Nav";
import Login from "./containers/Login";
import Profil from "./containers/Profil";
import SetProfil from "./containers/SetProfil";
import ResetPassword from "./containers/ResetPassword";
import UsersList from "./containers/UsersList";
import RequestsList from "./containers/RequestsList";
import Chat from "./components/Chat";

export class App extends Component {
  state = {
    links: [
      { titre: "Profil", href: "www.google.com" },
      { titre: "Deconnexion", href: "www.linkedin.com" }
    ]
  };

  componentDidMount() {
    connect();
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
          <Route exact path="/friendRequests" component={RequestsList} />
          <Redirect to="/login" />
        </Switch>
        <Chat />
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
