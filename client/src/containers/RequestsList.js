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
      user: {},
      message: null
    };
  }

  componentDidMount() {
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
            message: "Vous n'avez aucune invitation en attente"
          });
        }
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillReceiveProps() {
    this.setState({ user: this.props.user });
  }

  answerRequest = (id, status) => {
    console.log(id, status);
    // post(`/friendRequest/${status}`, id)
    //   .then(() => {
    //     console.log("request ignore");
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // console.log("remove friend from list", id);
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
                          onClick={(autor, status) =>
                            this.answerRequest(request.author, "accept")
                          }
                        >
                          Accepter
                        </button>
                        <button
                          onClick={(autor, status) =>
                            this.answerRequest(request.author, "ignore")
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
      </div>
    );
  }
}
export default withRouter(props => <RequestsList {...props} />);
