import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class RequestsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      requests: [],
      message: null
    };
  }

  componentDidMount() {
    get("/friendRequest")
      .then(friendRequests => {
        if (friendRequests.length > 0) {
          this.setState({
            loading: false,
            requests: friendRequests
          });
          console.log(this.state.requests);
        } else {
          this.setState({
            loading: false,
            message: "Vous n'avez aucune invitation en attente"
          });
        }
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderFriendRequest = request => {
    console.log(request);
    return (
      <div key={request._id}>
        <p>{request.author}</p>
        <button>Accepter</button>
        <button>Ignorer</button>
      </div>
    );
  };

  ignore = id => {
    console.log("remove friend from list");
  };

  accept = id => {
    console.log("go to friend profil", id);
  };

  render() {
    console.log(this.state.loading);
    return (
      <div>
        {this.state.loading ? (
          "Loading"
        ) : (
          <div>
            {this.state.requests.length > 0 ? (
              <div>{this.state.requests.map(this.renderFriendRequest)}</div>
            ) : (
              <p>{this.state.message}</p>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(props => <RequestsList {...props} />);
