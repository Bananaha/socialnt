import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get } from "../services/request.service";
import "whatwg-fetch";
import "../styles/SearchBar.css";
import classnames from "classnames";

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
          console.log(users);
          if (users.length > 0) {
            this.setState({
              loader: false,
              results: users
            });
          } else {
            this.setState({
              loader: true,
              alert: "Pas de correspondance."
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
    this.setState({ results: [], searchQuery: "" });
  };
  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }
  onSelectItem = (id, pseudo) => {
    this.props.onSelect(id, pseudo);
    this.setState({ results: [], searchQuery: "" });
  };

  render() {
    return (
      <form className="SearchBar" onSubmit={this.onSubmit}>
        <input
          onInput={this.handleChange}
          type="text"
          value={this.state.searchQuery || ""}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
        />
        {this.props.showButton === "false" ? (
          ""
        ) : (
          <button type="submit">Ok</button>
        )}
        <ul
          className={classnames("card SearchBar__results", {
            "SearchBar__results--empty":
              this.state.loader || this.state.results.length === 0
          })}
        >
          {this.state.loader
            ? ""
            : this.state.results.map((result, index) => {
                return (
                  <li
                    key={result._id}
                    onClick={(id, pseudo) =>
                      this.onSelectItem(result._id, result.pseudo)
                    }
                  >
                    {result.pseudo}
                  </li>
                );
              })}
        </ul>
        {this.state.alert && (
          <div className="SearchBar__results SearchBar__results--alert">
            {this.state.alert}
          </div>
        )}
      </form>
    );
  }
}

export default withRouter(props => <SearchBar {...props} />);
