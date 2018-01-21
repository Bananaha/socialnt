import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get } from "../services/request.service";
import "whatwg-fetch";

class UsersList extends Component {
  state = {
    searchResult: "",
    loader: true,
    alert: ""
  };

  getMatchingUsers = () => {
    const query = this.props.match.params.query;
    get(`/users/search/${query}`)
      .then(users => {
        if (users.results.length > 0) {
          this.setState({
            searchResult: users.results,
            loader: false
          });
        } else {
          this.setState({
            alert: "Aucun utilisateur ne correspond à votre recherche.",
            loader: false
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    console.log("coucou mount");
    this.getMatchingUsers();
  }

  componentWillReceiveProps() {
    console.log("coucou update");
    this.setState({
      loader: true
    });
    setTimeout(() => {
      this.getMatchingUsers();
    }, 200);
  }
  sendFriendRequest = pseudo => {
    console.log("pseudo", pseudo);
  };

  render() {
    return (
      <div>
        {this.state.loader
          ? ""
          : this.state.searchResult.map((result, index) => {
              let avatar = result.avatar;

              if (!result.avatar) {
                avatar = "default_avatar.png";
              }
              return (
                <div key={result.pseudo}>
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
                  <p>{result.pseudo}</p>
                  {result.isFriend ? (
                    <span>Ami</span>
                  ) : (
                    <button onClick={this.sendFriendRequest(result.pseudo)}>
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
