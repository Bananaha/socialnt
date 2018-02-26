import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";
import { Textarea, SmallButton } from "../styles/common";
import { COLOR_RED } from "../styles/variables";
import { transparentize } from "polished";
import styled from "styled-components";

const Form = styled.form`
  /* display: flex;
  flex-direction: column;
  align-items: flex-end; */
`;

const Alert = styled.p`
  text-align: center;
  color: ${COLOR_RED};
  background: ${transparentize(0.95, COLOR_RED)};
  margin: 12px -20px;
  padding: 12px;
`;

class BlockPost extends Component {
  state = {
    userPost: "",
    alert: ""
  };

  handleChange = key => event => {
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  submitPost = event => {
    event.preventDefault();
    const postInfos = {
      targetUser: this.props.match.params.id,
      post: this.state.userPost
    };

    post("/post/newPost", postInfos)
      .then(result => {
        this.setState({
          alert: result.post,
          userPost: ""
        });
        setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
        this.props.onSubmit();
      })
      .catch(error => {
        this.setState({ alert: error.post });
      });
  };

  render() {
    return (
      <Form onSubmit={this.submitPost}>
        <Textarea
          name="userPost"
          value={this.state.userPost || ""}
          onChange={this.handleChange("userPost")}
          placeholder="Quoi de neuf ?"
        />
        <SmallButton type="submit">Publier</SmallButton>
        {this.state.alert &&
          this.state.alert.length && <Alert>{this.state.alert}</Alert>}
      </Form>
    );
  }
}

export default withRouter(props => <BlockPost {...props} />);
