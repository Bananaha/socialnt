import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

import DeleteButton from "../components/DeleteButton";
import PostsList from "../components/PostsList";

class FriendsList extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    get("/users/friends")
      .then(friends => {
        console.log(friends);
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeFriend = id => {
    console.log("remove friend from list");
  };

  goToFriendProfil = id => {
    console.log("go to friend profil", id);
  };

  sendPrivateMessage = id => {
    console.log("send private message to", id);
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          "Loading"
        ) : (
          <div>
            <p>Liste d'amis</p>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <FriendsList {...props} />);
