import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class RequestsList extends Component {
  state = {
    loading: true,
    requests: [],
    message: undefined,
    alert: ""
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
  // TODO ==> gérer le probleme du reload de page
  getFriendRequests = () => {
    get("/friendRequest")
      .then(({ requests }) => {
        console.log(requests);
        if (requests.length > 0) {
          this.setState({
            loading: false,
            requests: requests
          });
        } else {
          this.setState({
            loading: false,
            message: "Vous n'avez aucune invitation en attente.",
            requests: requests
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,

          requests: []
        });
        this.showInformation(
          "Oh Oh! Houston nous avons un problème, votre requête n'a pu aboutir",
          "warning",
          () => this.props.history.push(`/profil/${this.props.user.id}`)
        );
      });
  };

  componentDidMount() {
    this.getFriendRequests();
  }

  answerRequest = (requestId, status, autor) => {
    console.log(requestId, status, autor);
    this.setState({
      loading: true
    });

    post(`/friendRequest/${status}`, { requestId: requestId })
      .then(() => {
        this.setState({
          loading: false
        });
        const confirmationMessage =
          status === "accept"
            ? `Vous êtes maintenant ami avec ${autor}`
            : `Vous avez rejeté l'invitation de ${autor}`;
        // TODO => je veux passer une fonction en argument pour qu'elle s'execute à la fin du timeout mais elle n'est pas reconnue comme fonction
        this.showInformation(confirmationMessage, "info", () =>
          this.getFriendRequests()
        );
      })

      .catch(() => {
        this.showInformation(
          "Oh Oh! Houston nous avons un problème, votre requête n'a pu aboutir",
          "warning"
        );
      });
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        {user && (
          <div>
            {user ? (
              <div>
                {this.state.requests.length > 0 ? (
                  <div>
                    {this.state.requests.map(request => {
                      if (
                        user.pseudo === request.author.pseudo ||
                        user._id === request.author
                      ) {
                        return (
                          <div key={request._id}>
                            <p>
                              {request.recipient.pseudo || request.recipient}
                            </p>
                            <span>En attente de confirmation</span>
                          </div>
                        );
                      } else {
                        return (
                          <div key={request._id}>
                            <p>{request.author.pseudo || request.author}</p>
                            <button
                              onClick={(requestId, status, author) =>
                                this.answerRequest(
                                  request._id,
                                  "accept",
                                  request.author.pseudo
                                )
                              }
                            >
                              Accepter
                            </button>
                            <button
                              onClick={(requestId, status, author) =>
                                this.answerRequest(
                                  request._id,
                                  "ignore",
                                  request.author.pseudo
                                )
                              }
                            >
                              Ignorer
                            </button>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <p>{this.state.message}</p>
                )}
              </div>
            ) : (
              "Loading"
            )}
          </div>
        )}
        {this.state.alert}
      </div>
    );
  }
}
export default withRouter(props => <RequestsList {...props} />);
