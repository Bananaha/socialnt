import React, { Component } from "react";
import { get } from "../services/request.service";

export default class Chat extends Component {
  state = {
    friends: []
  };

  componentDidMount() {
    get("/users/friends").then(friends => {
      this.setState({ friends });
    });
  }

  renderFriend = friend => {
    return <li key={friend._id}>{friend.pseudo}</li>;
  };

  render() {
    return (
      <div>
        <h2>Chat</h2>
        <ul>{this.state.friends.map(this.renderFriend)}</ul>
      </div>
    );
  }
}
