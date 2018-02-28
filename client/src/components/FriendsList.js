import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post } from "../services/request.service";
import "whatwg-fetch";

import SearchBar from "../components/SearchBar";
import "../styles/FriendList.css";

class FriendsList extends Component {
  state = {
    friends: [],
    loading: true,
    alert: "",
    wantToRecommend: {},
    recommendationDest: {}
  };

  getFriends = () => {
    get(`/users/friends/${this.props.match.params.id}`).then(result => {
      return this.setState({ loading: false, friends: result.friends });
    });
  };

  componentDidMount() {
    this.getFriends();
  }
  showInformation = (text, type, action) => {
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

  handleRecommendation = (friendId, friendPseudo) => {
    this.setState({ wantToRecommend: { _id: friendId, pseudo: friendPseudo } });
  };

  chooseFriend = (id, pseudo) => {
    if (!id || !pseudo) {
      return;
    }
    this.setState({
      recommendationDest: { _id: id, pseudo: pseudo }
    });
  };

  sendRecommendation = friendId => {
    post("/friendrequest/recommendation", {
      targetUser: this.state.recommendationDest._id,
      requestRecipient: friendId
    })
      .then(() => {
        this.cancelRecommendation();
        this.showInformation(
          `Votre recommandation a bien été envoyée.`,
          "info"
        );
      })
      .catch(error => {
        this.showInformation(
          `La recommandation de ${this.state.wantToRecommend.pseudo} à ${
            this.state.recommendationDest.pseudo
          } n'a pu aboutir. Réessayer plus tard.`,
          "warning"
        );
      });
  };
  cancelRecommendation = () => {
    this.setState({ wantToRecommend: {}, recommendationDest: {} });
  };
  removeFriends = (friendId, friendPseudo) => {
    post("/friendrequest/remove", { targetUser: friendId })
      .then(() => {
        this.showInformation(
          `${friendPseudo} ne fait plus partie de vos amis.`,
          "info",
          () => this.getFriends()
        );
        window.location.reload();
      })
      .catch(error => {
        this.showInformation(
          `Votre demande de suppression n'a pu aboutir. Réessayer plus tard.`,
          "warning"
        );
      });
  };

  render() {
    const sameUser =
      this.props.user && this.props.match.params.id === this.props.user.id;
    return (
      <div>
        {this.state.loading ||
        (this.state.friends && this.state.friends.length) ? (
          <div className="FriendList">
            <h3 className="page-title">
              {sameUser ? "Mes amis" : "Ses amis"}{" "}
            </h3>
            {this.state.loading ? (
              "Chargement..."
            ) : (
              <div>
                {this.state.friends.map(friend => {
                  const href = `/profil/${friend._id}`;
                  return (
                    <div key={friend._id} className="card FriendList__item">
                      <a href={href}>{friend.pseudo}</a>
                      {this.state.friends.length <= 1 ? (
                        ""
                      ) : (
                        <div>
                          {this.state.recommendationDest._id &&
                          this.state.wantToRecommend._id === friend._id ? (
                            <div>
                              <span>
                                Recommander {friend.pseudo} à{" "}
                                {this.state.recommendationDest.pseudo} ?
                              </span>
                              <button
                                className="button--small"
                                onClick={friendId =>
                                  this.sendRecommendation(friend._id)
                                }
                              >
                                Ok
                              </button>
                              <button
                                className="button--small"
                                onClick={this.cancelRecommendation}
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <button
                              className="button--small"
                              onClick={(friendId, friendPseudo) =>
                                this.handleRecommendation(
                                  friend._id,
                                  friend.pseudo
                                )
                              }
                            >
                              Recommander {friend.pseudo} à un ami
                            </button>
                          )}
                          {this.state.wantToRecommend &&
                          this.state.wantToRecommend._id === friend._id &&
                          !this.state.recommendationDest._id ? (
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
                      )}

                      <button
                        className="button--small"
                        onClick={(friendId, friendPseudo) =>
                          this.removeFriends(friend._id, friend.pseudo)
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {this.state.alert}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withRouter(props => <FriendsList {...props} />);
