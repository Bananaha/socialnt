import React, { Component } from "react";

export default class Comment extends Component {
  render() {
    const { _id, text, user, formattedDate } = this.props.comment;

    return (
      <div>
        <p>{formattedDate}</p>
        <span>{user.pseudo}</span>
        <p>{text}</p>
      </div>
    );
  }
}
