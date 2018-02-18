import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SearchBar from "./SearchBar";

class Nav extends Component {
  searchResults = query => {
    this.props.history.push("/search/" + query);
  };

  goTo = query => {
    this.props.history.push("/profile/" + query);
  };

  render() {
    return (
      <div>
        <h1>Cumulus</h1>
        <SearchBar
          onSubmit={this.searchResults}
          onSelect={this.goTo}
          requestPath="/users/search/"
        />
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
