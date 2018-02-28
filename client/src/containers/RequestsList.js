import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";
import "../styles/RequestList.css";

class RequestsList extends Component {
  state = {
    loading: true,
    requests: [],
    message: undefined,
    alert: ""
  };
  // Display notification to user
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
  getFriendRequests = () => {
    get("/friendRequest")
      .then(({ requests }) => {
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

        this.showInformation(confirmationMessage, "info", () =>
          this.getFriendRequests()
        );
        window.location.reload();
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
      <div className="RequestList page-body">
        <h3 className="page-title">Invitations</h3>
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
                          <div
                            className="card RequestList__item RequestList__item--in"
                            key={request._id}
                          >
                            <p className="RequestList__name">
                              {request.recipient.pseudo || request.recipient}
                            </p>
                            <span className="RequestList__status">
                              En attente de confirmation
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="card RequestList__item RequestList__item--out"
                            key={request._id}
                          >
                            <p className="RequestList__name">
                              {request.author.pseudo || request.author}
                            </p>
                            <button
                              className="button--small"
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
                              className="button--small"
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
