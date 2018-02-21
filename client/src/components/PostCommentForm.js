import React, { Component } from "react";
import { post } from "../services/request.service";

export default class PostCommentForm extends Component {
  state = {
    text: "",
    loading: false
  };

  onChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    if (!this.state.text) {
      return;
    }
    this.setState({
      loading: true
    });
    post(`/post/${this.props.postId}/comment`, {
      text: this.state.text
    })
      .then(result => {
        console.log("Update comments");
      })
      .catch(error => {
        console.error("Error while commenting post", error);
      });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          placeholder="Commentez ce post"
          type="text"
          value={this.state.text}
          onChange={this.onChange}
        />
        <button type="submit" disabled={!this.state.text}>
          Envoyer
        </button>
      </form>
    );
  }
}
