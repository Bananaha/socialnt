import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";
import moment from "moment";
import BlockPost from "./BlockPost";
import Post from "./Post";

class PostsList extends Component {
  state = {
    posts: [],
    nbPosts: 0,
    pagination: [],
    alert: undefined,
    loader: true
  };

  // compute pagination based on posts number
  computeResult = result => {
    let pages = [];
    for (let i = result.nbPosts, nbPages = 1; i > 0; i -= 10, nbPages++) {
      pages.push(nbPages);
    }
    result.posts.forEach(post => {
      post.formattedDate = moment(post.date).fromNow();
    });
    this.setState({
      pagination: pages,
      posts: result.posts,
      nbPosts: result.nbPosts,
      loader: false
    });
  };

  // request all posts where the author or recipient is the profile owner
  updatePosts = (page = 1) => {
    const id = this.props.match.params.id;
    get(`/post/${id}/${page}`)
      .then(this.computeResult)
      .catch(error => {
        console.error(error);
        this.setState({
          alert: error.alert
        });
        this.timeout = setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
      });
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    this.updatePosts();
  }

  loadNextPosts = page => event => {
    event.preventDefault();

    this.updatePosts(page);
  };
  renderPosts = () => {
    return (
      <div>
        <div>
          {this.state.posts.map(post => <Post key={post._id} post={post} />)}
        </div>
        <div>
          {this.state.pagination.map((page, index) => {
            return (
              <button onClick={this.loadNextPosts(page)} key={index}>
                {page}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <BlockPost onSubmit={this.updatePosts} />
        {this.state.loader ? <p>Loading..</p> : this.renderPosts()}
      </div>
    );
  }
}
export default withRouter(props => <PostsList {...props} />);
