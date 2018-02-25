import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post } from "../services/request.service";
import "whatwg-fetch";

class UsersList extends Component {
  state = {
    users: [],
    loader: true,
    alert: ""
  };

  getMatchingUsers = () => {
    const query = this.props.match.params.query;
    get(`/users/search/${query}`)
      .then(users => {
        if (users.length > 0) {
          this.setState({
            users: users,
            loader: false,
            alert: ""
          });
        } else {
          this.setState({
            users: [],
            alert: "Aucun utilisateur ne correspond à votre recherche.",
            loader: false
          });
        }
      })
      .catch(error => {
        this.setState({
          users: [],
          loader: false
        });
        console.log("getMtchingUsers UserList", error);
      });
  };

  launchTimeout = () => {
    this.timeout = setTimeout(() => {
      this.setState({
        alert: ""
      });
    }, 5000);
  };

  componentWillUnmount = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  componentDidMount() {
    this.getMatchingUsers();
  }

  componentWillReceiveProps() {
    this.setState({
      loader: true
    });
    setTimeout(() => {
      this.getMatchingUsers();
    }, 200);
  }

  sendFriendRequest = event => {
    event.preventDefault();
    post("/friendrequest", { targetUser: event.target.value })
      .then(result => {
        this.setState({
          alert: result.alert
        });
        this.launchTimeout();
        this.getMatchingUsers();
      })
      .catch(error => {
        this.setState({
          alert: error.alert
        });
        this.launchTimeout();
      });
  };

  render() {
    return (
      <div>
        {this.state.loader
          ? ""
          : this.state.users.map((user, index) => {
              let avatar = user.avatar;

              if (!user.avatar) {
                avatar = "default_avatar.png";
              }
              return (
                <div key={user.pseudo}>
                  <img
                    style={{
                      width: 50 + "px",
                      height: "auto",
                      borderRadius: 50 + "px",
                      border: 1 + "px"
                    }}
                    src={process.env.REACT_APP_HOST + "/images/" + avatar}
                    alt="avatar"
                  />
                  <p>{user.pseudo}</p>
                  {user.isFriend ? (
                    <a href={`/profile/${user._id}`}>Voir le profil</a>
                  ) : (
                    <button value={user._id} onClick={this.sendFriendRequest}>
                      Ajouter
                    </button>
                  )}
                </div>
              );
            })}
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <UsersList {...props} />);
