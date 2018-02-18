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
      searchQuery: value,
      loader: true,
      results: [],
      alert: ""
    });
    if (value === "") {
      this.setState({
        results: value
      });
      return;
    }
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      get(`${this.props.requestPath}${value}`)
        .then(users => {
          console.log(users.results);
          if (users.results.length > 0) {
            this.setState({
              loader: false,
              results: users.results
            });
          } else {
            this.setState({
              loader: true,
              alert: "Ce pseudo n'existe pas."
            });
          }
        })
        .catch(error => {
          console.log("handleChange SearchBar", error);
        });
    }, 300);
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.searchQuery);
  };

  onSelectItem = id => {
    // TODO ===> si je suis sur mon profil et que j'accède à un autre profil, le template de change pas
    this.props.onSelect(id);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
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
                return (
                  <div key={result.pseudo}>
                    <p
                      key={result._id}
                      onClick={id => this.onSelectItem(result._id)}
                    >
                      {result.pseudo}
                    </p>
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
