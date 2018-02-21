import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect, subscribe } from "./sockets";
import TYPES from "./sockets/types";

import "./App.css";
import Nav from "./components/Nav";
import Login from "./containers/Login";
import Profil from "./containers/Profil";
import SetProfil from "./containers/SetProfil";
import ResetPassword from "./containers/ResetPassword";
import UsersList from "./containers/UsersList";
import RequestsList from "./containers/RequestsList";
import Chat from "./components/Chat";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

export class App extends Component {
  state = {
    user: undefined
  };

  setUser = (user = {}) => {
    this.setState({
      user: !user.profile || user.profile === "visitor" ? undefined : user
    });
  };

  componentDidMount() {
    subscribe(TYPES.USER_INFO, this.setUser);
    connect();
  }

  render() {
    return (
      <div>
        <Nav user={this.state.user} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/profile/:id"
            render={props => <Profil {...props} user={this.state.user} />}
          />
          <Route exact path="/setProfil/:id" component={SetProfil} />
          <Route exact path="/resetPassword/" component={ResetPassword} />
          <Route exact path="/resetPassword/:token" component={ResetPassword} />
          <Route exact path="/search/:query" component={UsersList} />
          <Route
            exact
            path="/friendRequests"
            render={props => <RequestsList {...props} user={this.state.user} />}
          />
          <Redirect to="/login" />
        </Switch>
        {this.state.user && <Chat />}
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
