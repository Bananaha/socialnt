import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import classnames from "classnames";
import "../styles/Nav.css";

class Nav extends Component {
  searchResults = query => {
    this.props.history.push("/search/" + query);
  };

  goTo = query => {
    this.props.history.push("/profil/" + query);
  };

  renderNavLink = (href, name, onClick) => {
    return (
      <Link className="Nav__link" to={href} onClick={onClick}>
        {name}
      </Link>
    );
  };

  disconnect = () => {
    localStorage.removeItem("token");
  };

  render() {
    const { user } = this.props;
    return (
      <div className={classnames("Nav", { "Nav--login": !user })}>
        <h1>Unicorn's Corner</h1>
        {user && (
          <div className="Nav__links">
            {this.renderNavLink(`/profil/${user.id}`, user.pseudo)}
            {this.renderNavLink("/friendRequests", "Invitations")}
            {this.renderNavLink("/mail/", "Messagerie")}
            {user.profile === "admin" &&
              this.renderNavLink("/admin", "Administration")}
            {this.renderNavLink("/login", "Déconnexion", this.disconnect)}
          </div>
        )}
        {user && (
          <SearchBar
            onSubmit={this.searchResults}
            onSelect={this.goTo}
            requestPath="/users/search/"
            placeholder="Chercher un utilisateur"
          />
        )}
      </div>
    );
  }
}
export default withRouter(props => <Nav {...props} />);
