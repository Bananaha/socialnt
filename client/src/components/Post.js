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
  render() {
    const {
      comments,
      author,
      dest,
      _id,
      content,
      formattedDate
    } = this.props.post;

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
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
        <PostCommentForm postId={_id} />
      </PostContainer>
    );
  }
}
