import React, { Component } from "react";

export default class ChatConversation extends Component {
  render() {
    return <div>{this.props.historic}</div>;
  }
}
