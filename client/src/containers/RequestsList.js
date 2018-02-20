import React, { Component } from "react";
import { get, del } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

class RequestsList extends Component {
  state = {
    loading: true,
    requests: [],
    message: null
  };

  componentDidMount() {
    console.log("invitation mount");
    get("/friendRequest")
      .then(requests => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  ignore = id => {
    console.log("remove friend from list");
  };

  accept = id => {
    console.log("go to friend profil", id);
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          "Loading"
        ) : (
          <div>
            <p>Liste des invitations</p>

            {this.state.requests.map((request, index) => {
              console.log(this.props.match.params.id, request.author);
              <div>
                <p>{request.author}</p>
                <p>{request.recipient}</p>
                <p>{request.status}</p>
              </div>;

              {
                /* {
                request.author === this.props.match.params.id ? (
                  <div>
                    <h3>{request.recipient}</h3>
                    <span>Invitation en attente</span>
                  </div>
                ) : (
                  <div>
                    <h3>{request.author}</h3>
                    <button>Accepter</button>
                    <button>Ignorer</button>
                  </div>
                );
              } */
              }
            })}
          </div>
        )}
      </div>
    );
  }
}
export default RequestsList;
