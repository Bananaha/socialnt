import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import classnames from "classnames";

class Footer extends Component {
  render() {
    return (
      <div
        className={classnames("Footer", { "Footer--login": this.props.login })}
      >
        Unicorn's Corner - 2018 - <Link to="/about">A propos</Link>
      </div>
    );
  }
}
export default withRouter(props => <Footer {...props} />);
