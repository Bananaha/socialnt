import React, { Component } from "react";

export default class Comment extends Component {
  render() {
    const { _id, text, user, date } = this.props.comment;

    return (
      <div>
        <p>{date}</p>
        <span>{user}</span>
        <p>{text}</p>
      </div>
    );
  }
}
