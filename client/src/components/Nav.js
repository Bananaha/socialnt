import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";

class Nav extends Component {
  state = {
    navItems: [
      {
        name: "Profil",
        href: "/profil/"
      },
      {
        name: "Déconnexion",
        href: "/login"
      },
      {
        name: "Administration",
        href: "/admin"
      },
      {
        name: "Invitations",
        href: "/friendRequests"
      }
    ]
  };
  searchResults = query => {
    this.props.history.push("/search/" + query);
  };

  goTo = query => {
    this.props.history.push("/profil/" + query);
  };

  onClick = item => {
    const navItem = this.state.navItems.find(navItem => {
      return navItem.name === item;
    });

    if (navItem.name === "Déconnexion") {
      localStorage.removeItem("token");
      this.props.history.push(navItem.href);
    }
    if (navItem.name === "Profil") {
      get("/users/findUserProfil")
        .then(id => this.props.history.push(navItem.href + id.user))
        .catch(error => console.log(error));
    }
    if (navItem.name === "Invitations") {
      this.props.history.push(navItem.href);
    }
  };

  render() {
    return (
      <div>
        <h1>Unicorn's Corner</h1>
        <SearchBar
          onSubmit={this.searchResults}
          onSelect={this.goTo}
          requestPath="/users/search/"
          placeholder="Chercher un utilisateur"
        />
        {this.state.navItems.map(item => {
          return (
            <button
              type="button"
              key={item.name}
              href={item.href}
              onClick={name => this.onClick(item.name)}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    );
  }
}

// class Link extends Component {
//   render() {
//     return <a href={this.props.href}>{this.props.titre}</a>;
//   }
// }
export default withRouter(props => <Nav {...props} />);
