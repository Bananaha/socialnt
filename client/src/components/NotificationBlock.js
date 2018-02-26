import React, { Component } from "react";

export default class Post extends Component {
  render() {
    const { text, type } = this.props.notif;

    return (
      <div>
        <span>{type === "success" ? <img/> : }</span>
      </div>
    );
  }
}
