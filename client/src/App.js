import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect, subscribe } from "./sockets";
import TYPES from "./sockets/types";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Login from "./containers/Login";
import Profil from "./containers/Profil";
import SetProfil from "./containers/SetProfil";
import ResetPassword from "./containers/ResetPassword";
import UsersList from "./containers/UsersList";
import Admin from "./containers/Admin";
import RequestsList from "./containers/RequestsList";
import Chat from "./components/Chat";
import Mail from "./containers/Mail";
import About from "./containers/About";
import "normalize.css";
import moment from "moment";
import "moment/locale/fr";
import "typeface-lobster";
import "typeface-roboto";
import "./index.css";
import "./styles/common.css";

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
    const isLogin =
      this.props.location.pathname.indexOf("/login") === 0 ||
      this.props.location.pathname.indexOf("/resetPassword") === 0;
    return (
      <div login={isLogin} className="flex-extend">
        <Nav user={this.state.user} />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/profil/:id"
            render={props => <Profil {...props} user={this.state.user} />}
          />
          <Route exact path="/setProfil/:id" component={SetProfil} />
          <Route exact path="/resetPassword/" component={ResetPassword} />
          <Route
            exact
            path="/resetPassword/:token"
            component={ResetPassword}
            className="wrapper"
          />
          <Route exact path="/search/:query" component={UsersList} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/about" component={About} />
          <Route
            exact
            path="/friendRequests"
            render={props => <RequestsList {...props} user={this.state.user} />}
          />
          <Route
            exact
            path="/mail"
            render={props => <Mail {...props} user={this.state.user} />}
          />
          <Redirect to="/login" />
        </Switch>
        {this.state.user &&
          this.state.user.profile !== "visitor" && (
            <Chat user={this.state.user} />
          )}
        <Footer login={isLogin} />
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);
