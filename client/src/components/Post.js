import React, { Component } from "react";
import Comment from "./Comment";
import PostCommentForm from "./PostCommentForm";
import "../styles/Post.css";

export default class Post extends Component {
  state = {
    showComments: false,
    toogleButtonText: "Voir les commentaires"
  };

  handleCommentSubmit = () => {
    this.props.handleCommentSubmit();
  };

  toogleCommentsVisibility = () => {
    this.setState({
      showComments: !this.state.showComments
    });
    if (this.state.showComments) {
      this.setState({
        toogleButtonText: "Voir les commentaires"
      });
    } else {
      this.setState({
        toogleButtonText: "Masquer les commentaires"
      });
    }
  };

  hasComments = () => {};
  render() {
    const {
      comments,
      author,
      dest,
      _id,
      content,
      formattedDate
    } = this.props.post;
    console.log(comments);
    return (
      <div className="card Post" key={_id}>
        <div className="Post__header">
          <div className="Post__header__user">
            <span>{author && author.pseudo}</span>
            {dest &&
              dest._id !== author._id && (
                <span>
                  <span> > </span>
                  <span>{dest.pseudo}</span>
                </span>
              )}
          </div>

          <div className="Post__date">{formattedDate}</div>
        </div>

        <p className="Post__content">{content}</p>
        {this.state.showComments ? (
          <div className="Post__comments">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="Post__showButton">
          {comments.length > 0 ? (
            <button
              className="button--small"
              onClick={this.toogleCommentsVisibility}
            >
              {this.state.toogleButtonText}
            </button>
          ) : (
            ""
          )}
        </div>
        <PostCommentForm
          postId={_id}
          handleCommentSubmit={this.handleCommentSubmit}
        />
      </div>
    );
  }
}
