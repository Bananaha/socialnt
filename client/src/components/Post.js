import React, { Component } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import PostCommentForm from "./PostCommentForm";

const PostContainer = styled.div`
  border-bottom: 1px solid #ccc;
  padding-bottom: 12px;
  margin-bottom: 12px;

  &:last-child {
    border-bottom: none;
    padding-bottom: none;
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostDate = styled.div`
  font-weight: 100;
  font-size: 12px;
`;

export default class Post extends Component {
  state = {
    showComments: false,
    toogleButtonText: "Voir plus"
  };

  handleCommentSubmit = () => {
    this.props.handleCommentSubmit();
    console.log("submit");
  };
  toogleCommentsVisibility = () => {
    this.setState({
      showComments: !this.state.showComments
    });
    if (this.state.showComments) {
      this.setState({
        toogleButtonText: "Voir plus"
      });
    } else {
      this.setState({
        toogleButtonText: "Masquer"
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
      <PostContainer key={_id}>
        <PostHeader>
          <div>
            <span>{author && author.pseudo}</span>
            {dest &&
              dest._id !== author._id && (
                <span>
                  <span> > </span>
                  <span>{dest.pseudo}</span>
                </span>
              )}
          </div>

          <PostDate>{formattedDate}</PostDate>
        </PostHeader>

        <p>{content}</p>
        <div>
          {this.state.showComments ? (
            <div>
              {comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
        <PostCommentForm
          postId={_id}
          handleCommentSubmit={this.handleCommentSubmit}
        />
        <div>
          {comments.length > 0 ? (
            <button onClick={this.toogleCommentsVisibility}>
              {this.state.toogleButtonText}
            </button>
          ) : (
            ""
          )}
        </div>
      </PostContainer>
    );
  }
}
