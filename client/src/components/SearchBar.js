import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get } from "../services/request.service";
import "whatwg-fetch";

class SearchBar extends Component {
  state = {
    searchQuery: "",
    results: [],
    loader: true,
    alert: ""
  };

  timeOut = undefined;

  handleChange = event => {
    const value = event.target.value;
    this.setState({
      searchQuery: value
    });
    if (value === "") {
      this.setState({
        loader: true,
        results: value
      });
      return;
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      console.log("value", value);
      get(`/users/search/${value}`)
        .then(users => {
          console.log(users);
          if (users.results) {
            this.setState({
              loader: false,
              results: users.results,
              alert: ""
            });
          } else {
            this.setState({
              loader: false,
              alert: "Ce pseudo n'existe pas."
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 300);
  };

  searchUsers = event => {
    event.preventDefault();
    const query = this.state.searchQuery;
    console.log("query", query);
    this.props.history.push("/search/" + query);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.searchUsers}>
          <input
            onInput={this.handleChange}
            type="text"
            placeholder="Chercher un utilisateur"
          />
          <button>Ok</button>
        </form>
        <div>
          {this.state.loader
            ? ""
            : this.state.results.map((result, index) => {
                console.log(result._id);
                return (
                  <div key={result.pseudo}>
                    <a href={`/profil/${result._id}`}>{result.pseudo}</a>
                  </div>
                );
              })}
        </div>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <SearchBar {...props} />);
