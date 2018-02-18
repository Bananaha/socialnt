import React, { Component } from "react";
import { get } from "../services/request.service";
import { withRouter } from "react-router-dom";
import "whatwg-fetch";
import BlockPost from "./BlockPost";

class PostsList extends Component {
  state = {
    posts: "",
    nbPosts: "",
    pagination: "",
    alert: "",
    loader: true
  };

  // compute pagination based on posts number
  computePosts = posts => {
    let pages = [];
    for (let i = posts.nbPosts, nbPages = 1; i > 0; i -= 10, nbPages++) {
      pages.push(nbPages);
    }
    this.setState({
      pagination: pages,
      posts: posts.posts,
      nbPosts: posts.nbPosts,
      loader: false
    });
  };

  // request all posts where the author or recipient is the profile owner
  updatePosts = page => {
    const id = this.props.match.params.id;
    get(`/post/${id}/${page}`)
      .then(result => {
        console.log(result);
        this.computePosts(result);
      })
      .catch(error => {
        console.error(error);
        this.setState({
          alert: error.alert
        });
        setTimeout(() => {
          this.setState({ alert: "" });
        }, 5000);
      });
  };

  componentDidMount() {
    this.updatePosts();
  }

  loadNextPosts = page => event => {
    event.preventDefault();

    this.updatePosts(page);
  };

  render() {
    return (
      <div>
        <BlockPost onSubmit={this.updatePosts} />
        {this.state.loader ? (
          <p>Loading..</p>
        ) : (
          <div>
            <div>
              {this.state.posts.map((post, index) => {
                return (
                  <div key={post._id}>
                    <div>
                      {post.dest ? (
                        <div>
                          <span>{post.autor}</span>
                          <span> | </span>
                          <span>{post.dest}</span>
                        </div>
                      ) : (
                        <span>{post.autor}</span>
                      )}
                    </div>

                    <p>{post.content}</p>
                    <span>{post.date}</span>
                  </div>
                );
              })}
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
        )}
      </div>
    );
  }
}
export default withRouter(props => <PostsList {...props} />);
