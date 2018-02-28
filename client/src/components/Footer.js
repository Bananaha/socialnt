import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

class Footer extends Component {
  renderNavLink = (href, name, onClick) => {
    return (
      <a to={href} onClick={onClick}>
        {name}
      </a>
    );
  };

  render() {
    return (
      <div>
        <a href="/about">A propos</a>
      </div>
    );
  }
}
export default withRouter(props => <Footer {...props} />);
