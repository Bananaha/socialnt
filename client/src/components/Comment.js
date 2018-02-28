import React, { Component } from "react";

export default class Comment extends Component {
  render() {
    const { _id, text, user, formattedDate } = this.props.comment;

    return (
      <div className="Comment">
        <div className="Comment__head">
          <div className="Comment__user">{user.pseudo}</div>
          <div className="Comment__date">{formattedDate}</div>
        </div>
        <div className="Comment__text">{text}</div>
      </div>
    );
  }
}
