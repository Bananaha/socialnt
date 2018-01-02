import React, { Component } from "react";

class Nav extends Component {
  render() {
    return (
      <div>
        <h1>Cumulus</h1>
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
