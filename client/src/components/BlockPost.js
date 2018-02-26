import React, { Component } from "react";
import { post } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";

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
      <div>
        <form onSubmit={this.submitPost}>
          <textarea
            name="userPost"
            cols="30"
            rows="10"
            value={this.state.userPost || ""}
            onChange={this.handleChange("userPost")}
            placeholder="Quoi de neuf ?"
          />
          <button type="submit">Publier</button>
        </form>
        <p>{this.state.alert}</p>
      </div>
    );
  }
}

export default withRouter(props => <BlockPost {...props} />);
