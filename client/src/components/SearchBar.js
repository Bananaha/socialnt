import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get } from "../services/request.service";
import "whatwg-fetch";
import { Input, Button, Card } from "../styles/common";
import styled from "styled-components";
import { BUTTON_COLOR, COLOR_PINK } from "../styles/variables";

const Form = styled.form`
  display: flex;
  position: relative;

  input {
    font-size: 14px;
    border: none;
    height: 30px;
    width: 200px;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  button {
    transition: 0.2s ease-out;
    transition-property: background-color, color;
    font-size: 14px;
    height: 30px;
    border: none;
    background: none;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: ${BUTTON_COLOR};
      color: white;
    }
  }
`;

const ResultsContainer = Card.withComponent("ul").extend`
  position: absolute;
  background: white;
  width: 200px;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  top: 100%;

  ${props =>
    props.empty &&
    `
    padding: 0;
  `};

  li {
    list-style: none;
    font-size: 13px;
    cursor: pointer;
    
    &:hover,
    &:focus {
      color: ${COLOR_PINK};
    }
  }
`;

const Alert = ResultsContainer.withComponent("div").extend`
  font-size: 13px;
  color: #CCC;
  text-align: center;
`;

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
      <Form onSubmit={this.onSubmit}>
        <Input
          onInput={this.handleChange}
          type="text"
          value={this.state.searchQuery || ""}
          placeholder={this.props.placeholder}
        />
        {this.props.showButton === "false" ? (
          ""
        ) : (
          <button type="submit">Ok</button>
        )}
        <ResultsContainer
          empty={this.state.loader || this.state.results.length === 0}
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
        </ResultsContainer>
        {this.state.alert && <Alert>{this.state.alert}</Alert>}
      </Form>
    );
  }
}

export default withRouter(props => <SearchBar {...props} />);
