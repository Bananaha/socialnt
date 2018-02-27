import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post } from "../services/request.service";
import "whatwg-fetch";

class UsersList extends Component {
  state = {
    users: [],
    loading: true,
    alert: ""
  };

  getMatchingUsers = () => {
    const query = this.props.match.params.query;
    get(`/users/search/${query}`)
      .then(users => {
        if (users.length > 0) {
          this.setState({
            users: users,
            loading: false,
            alert: ""
          });
        } else {
          this.setState({
            users: [],
            alert: "Aucun utilisateur ne correspond à votre recherche.",
            loading: false
          });
        }
      })
      .catch(error => {
        this.setState({
          users: [],
          alert:
            "Oh Oh! Houston nous avons un problème, votre requête n'a pu aboutir",
          loading: false
        });
        console.log("getMtchingUsers UserList", error);
      });
  };

  // Display notification to user
  showInformation = (text, type, action) => {
    // TODO ==> use type argument for style settings
    // info or warning
    this.setState({
      alert: text
    });
    setTimeout(() => {
      this.setState({ alert: "" });
      if (action) {
        action();
      }
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
      loading: true
    });
    setTimeout(() => {
      this.getMatchingUsers();
    }, 200);
  }

  sendFriendRequest = event => {
    event.preventDefault();
    post("/friendrequest", { targetUser: event.target.value })
      .then(result => {
        // TODO => je veux passer une fonction en argument pour qu'elle s'execute à la fin du timeout mais elle n'est pas reconnue comme fonction
        this.showInformation(result.friends.alert, "info", () =>
          this.getMatchingUsers()
        );
      })
      .catch(error => {
        console.log(error);
        this.showInformation(
          "Oh Oh! Houston nous avons un problème, votre requête n'a pu aboutir",
          "warning"
        );
      });
  };

  render() {
    return (
      <div>
        {this.state.loading
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
                    <a href={`/profil/${user._id}`}>Voir le profil</a>
                  ) : (
                    <div>
                      {user.isInvited ? (
                        <span>Invitation envoyée</span>
                      ) : (
                        <button
                          value={user._id}
                          onClick={this.sendFriendRequest}
                        >
                          Ajouter
                        </button>
                      )}
                    </div>
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
