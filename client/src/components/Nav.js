import React, { Component } from "react";
import SearchBar from "./SearchBar";

class Nav extends Component {
  render() {
    return (
      <div>
        <h1>Cumulus</h1>
        <SearchBar />
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
export default Nav;
