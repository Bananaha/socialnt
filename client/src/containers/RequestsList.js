import React, { Component } from "react";
import { get, post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class RequestsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      requests: [],
      message: undefined,
      alert: ""
    };
  }

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
            message: "Vous n'avez aucune invitation en attente"
          });
        }
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getFriendRequests();
  }

  answerRequest = (requestId, status, autor) => {
    console.log(requestId, status);
    post(`/friendRequest/${status}`, { requestId: requestId })
      .then(() => {
        this.getFriendRequests();
        const confirmationMessage =
          status === "accept"
            ? `Vous êtes maintenant ami avec ${autor}`
            : `Vous avez rejeté l'invitation de ${autor}`;
        this.setState({
          alert: confirmationMessage
        });
        setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
      })
      .catch(error => {
        this.setState({
          message: error.alert
        });
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
                {this.state.requests.map(request => {
                  if (user.pseudo === request.authorPseudo) {
                    return (
                      <div key={request._id}>
                        <p>{request.recipientPseudo}</p>
                        <span>En attente de confirmation</span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={request._id}>
                        <p>{request.authorPseudo}</p>
                        <button
                          onClick={(requestId, status, autor) =>
                            this.answerRequest(request._id, "accept")
                          }
                        >
                          Accepter
                        </button>
                        <button
                          onClick={(requestId, status) =>
                            this.answerRequest(request._id, "ignore")
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
