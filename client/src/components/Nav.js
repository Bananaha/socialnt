import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import { BORDER_COLOR, COLOR_PINK, COLOR_GREY } from "../styles/variables";
import { Link } from "react-router-dom";

let Navigation = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 3px;
  padding-right: 3px;

  ${props =>
    props.login
      ? `
        border-bottom: none;
        text-align: center;
        justify-content: center;
      `
      : `
        background: #F4F4F4;
        justify-content: space-between;
      `};

  h1 {
    margin: 0;
    font-family: "Lobster";
    color: ${COLOR_PINK};
    font-size: 30px;

    ${props =>
      props.login &&
      `
      color: white;
      font-size: 44px;
      text-shadow: 1px 1px 6px rgba(50, 50, 0, 0.4);
      position: relative;
      z-index: 1;
    `};
  }
`;

const Links = styled.div`
  display: flex;
  border-left: 1px solid #eee;
  margin-left: 24px;
  max-width: 100%;
  width: 400px;
`;

const CustomLink = styled.a`
  flex: 1;
  text-align: center;
  margin-left: 40px;
  transition: 0.3s ease-out;
  transition-property: border-color, background-color, color;
  text-decoration: none;
  color: ${COLOR_GREY};
  font-weight: 300;
  font-size: 15px;
  border-bottom: 2px solid transparent;
  padding: 16px 0 4px;

  &:hover,
  &:focus {
    border-bottom-color: rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.3);
    color: ${COLOR_PINK};
  }
`;

const NavLink = CustomLink.withComponent(Link);

class Nav extends Component {
  searchResults = query => {
    this.props.history.push("/search/" + query);
  };

  goTo = query => {
    this.props.history.push("/profil/" + query);
  };

  renderNavLink = (href, name, onClick) => {
    return (
      <NavLink to={href} onClick={onClick}>
        {name}
      </NavLink>
    );
  };

  disconnect = () => {
    localStorage.removeItem("token");
  };

  render() {
    const { user } = this.props;
    return (
      <Navigation login={!user}>
        <h1>Unicorn's Corner</h1>
        {user && (
          <Links>
            {this.renderNavLink(`/profil/${user.id}`, user.pseudo)}
            {this.renderNavLink("/friendRequests", "Invitations")}
            {this.renderNavLink("/mail/", "Messagerie")}
            {user.profile === "admin" &&
              this.renderNavLink("/admin", "Administration")}
            {this.renderNavLink("/login", "Déconnexion", this.disconnect)}
          </Links>
        )}
        {user && (
          <SearchBar
            onSubmit={this.searchResults}
            onSelect={this.goTo}
            requestPath="/users/search/"
            placeholder="Chercher un utilisateur"
          />
        )}
      </Navigation>
    );
  }
}
export default withRouter(props => <Nav {...props} />);
