import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import openSocket from "socket.io-client";

import { deepPurple700 } from "material-ui/styles/colors";
import { yellow700 } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import AppBar from "material-ui/AppBar";

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

  muiTheme = getMuiTheme({
    palette: {
      textColor: deepPurple700
    },
    appBar: {
      height: 50
    }
  });

  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiTheme}>
        <Nav links={this.state.links} />
        <AppBar title="cumulus" />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/profil/:id" component={Profil} />
          <Route exact path="/setProfil/:id" component={SetProfil} />
          <Route exact path="/resetPassword/" component={ResetPassword} />
          <Route exact path="/resetPassword/:token" component={ResetPassword} />
          <Redirect to="/" />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(props => <App {...props} />);
