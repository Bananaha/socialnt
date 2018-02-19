import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import DeleteButton from "../components/DeleteButton";
import PostsList from "../components/PostsList";

class FriendsList extends Component {
  state = {};

  componentDidMount() {
    get("/users/friends")
      .then(friends => {
        console.log(friends);
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteProfil = () => {
    console.log("deleteProfil");
    del("/users")
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return <div>{}</div>;
  }
}
export default withRouter(props => <FriendsList {...props} />);
