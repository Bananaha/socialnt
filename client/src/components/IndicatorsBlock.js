import React, { Component } from "react";
import { subscribe } from "../sockets";
import { ON_CONNECTIONS_UPDATE, ON_POST_PUBLISH } from "../sockets/types";
import { get } from "../services/request.service";
import styled from "styled-components";
import { COLOR_PINK } from "../styles/variables";
import { darken } from "polished";

const Indicators = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  width: 380px;
  max-width: 100%;
  position: relative;
  z-index: 1;

  > div {
    display: flex;
    flex: 1;
    /* justify-content: center; */
    align-items: center;
    margin-top: 12px;
    /* text-align: left; */

    &:first-child {
      justify-content: flex-end;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      padding-right: 22px;
      margin-right: 22px;
    }
  }

  b {
    font-family: "lobster";
    font-size: 36px;
    margin-right: 12px;
    color: ${darken(0.5, COLOR_PINK)};
  }

  span {
    font-weight: 400;
    font-size: 14px;
    width: 30px;
    color: ${darken(0.3, COLOR_PINK)};
  }
`;

class IndicatorsBlock extends Component {
  state = {
    nbConnectedUsers: "",
    nbPublishedPosts: ""
  };

  postPublishSub = undefined;
  connectionsUpdateSub = undefined;

  listenSocketEvents() {
    this.postPublishSub = subscribe(ON_POST_PUBLISH, payload => {
      this.setState({ nbPublishedPosts: payload.postsCounts });
    });

    this.connectionsUpdateSub = subscribe(ON_CONNECTIONS_UPDATE, payload => {
      this.setState({ nbConnectedUsers: payload.connectionsCount });
    });
  }

  componentDidMount() {
    get("/post").then(result => {
      this.setState({
        nbPublishedPosts: result.nbPosts,
        nbConnectedUsers: result.nbConnectedUsers
      });
    });
    this.listenSocketEvents();
  }

  componentWillUnmount() {
    this.postPublishSub();
    this.connectionsUpdateSub();
  }

  render() {
    const { nbPublishedPosts, nbConnectedUsers } = this.state;
    return (
      <Indicators>
        <div>
          <b>{nbPublishedPosts}</b>
          <span>{nbPublishedPosts > 1 ? "posts publiés" : "post publié"}</span>
        </div>
        <div>
          <b>{nbConnectedUsers}</b>
          <span>
            {nbConnectedUsers > 1 ? "membres connectés" : "membre connecté"}
          </span>
        </div>
      </Indicators>
    );
  }
}

export default IndicatorsBlock;
