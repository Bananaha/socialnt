import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";

class Nav extends Component {
  searchUsers = query => {
    this.props.history.push("/search/" + query);
  };

  render() {
    return (
      <div>
        <h1>Cumulus</h1>
        <SearchBar onSubmit={this.searchUsers} />
        {this.props.links.map(link => {
          return <Link key={link.titre} href={link.href} titre={link.titre} />;
        })}
      </div>
    );
  }
}

class Link extends Component {
  render() {
    return <a href={this.props.href}>{this.props.titre}</a>;
  }
}
export default withRouter(props => <Nav {...props} />);
