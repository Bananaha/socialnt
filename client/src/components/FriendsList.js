import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post } from "../services/request.service";
import "whatwg-fetch";

import SearchBar from "../components/SearchBar";

class FriendsList extends Component {
  state = {
    friends: [],
    loading: true,
    alert: "",
    wantToRecommand: undefined,
    recommandationDest: {}
  };

  handleRecommandation = friendId => {
    this.setState({ wantToRecommand: friendId });
  };
  componentDidMount() {
    get("/users/friends")
      .then(result =>
        this.setState({ loading: false, friends: result.friends })
      )
      .catch(error => console.log(error));
  }

  // Add a new recipient to a message
  chooseFriend = (id, pseudo) => {
    console.log(id, pseudo);
    this.setState({
      wantToRecommand: undefined,
      recommandationDest: { _id: id, pseudo: pseudo }
    });

    // return (
    //   <div>
    //     <button onClick={friendId => this.sendRecommandation(id)}>
    //       Recommander à {pseudo}
    //     </button>
    //     <button onClick={this.cancelRecommandation}>Annuler</button>
    //   </div>
    // );
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          "Chargement..."
        ) : (
          <div>
            {this.state.friends.map(friend => {
              const href = `/profil/${friend._id}`;
              return (
                <div key={friend._id}>
                  <a href={href}>{friend.pseudo}</a>
                  <button
                    onClick={friendId => this.handleRecommandation(friend._id)}
                  >
                    Recommander {friend.pseudo} à un{" "}
                    {this.state.recommandationDest.pseudo || "ami"}
                  </button>
                  {this.state.recommandationDest.pseudo ? (
                    <button>Annuler</button>
                  ) : (
                    ""
                  )}
                  {this.state.wantToRecommand === friend._id ? (
                    <SearchBar
                      onSubmit={this.chooseFriend}
                      onSelect={this.chooseFriend}
                      requestPath="/users/search/friends/"
                      placeholder="Choisissez un ami"
                      showButton="false"
                    />
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(props => <FriendsList {...props} />);
