import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import styled from "styled-components";

const Navigation = styled.div`
  border-bottom: 1px solid #ccc;
`;

const Links = styled.div`
  display: flex;
`;

const Link = styled.a`
  margin-left: 12px;
`;

class Nav extends Component {
  searchResults = query => {
    this.props.history.push("/search/" + query);
  };

  goTo = query => {
    this.props.history.push("/profile/" + query);
  };

  renderNavLink = (href, name, onClick) => {
    return (
      <Link href={href} onClick={onClick}>
        {name}
      </Link>
    );
  };

  disconnect = () => {
    localStorage.removeItem("token");
  };

  getProfile = e => {
    e.preventDefault();
    get("/users/findUserProfil")
      .then(id => this.props.history.push("/profile/" + id.user))
      .catch(error => console.log(error));
  };

  render() {
    const { user } = this.props;
    return (
      <Navigation>
        <h1>Unicorn's Corner</h1>
        {user && (
          <div>
            <SearchBar
              onSubmit={this.searchResults}
              onSelect={this.goTo}
              requestPath="/users/search/"
              placeholder="Chercher un utilisateur"
            />
            <Links>
              {this.renderNavLink("/profile/", "Profil", this.getProfile)}
              {this.renderNavLink("/login", "Déconnexion", this.disconnect)}
              {user.profile === "admin" &&
                this.renderNavLink("/admin", "Administration")}
            </Links>
          </div>
        )}
      </Navigation>
    );
  }
}

// class Link extends Component {
//   render() {
//     return <a href={this.props.href}>{this.props.titre}</a>;
//   }
// }
export default withRouter(props => <Nav {...props} />);
