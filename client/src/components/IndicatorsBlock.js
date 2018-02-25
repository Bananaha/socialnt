import React, { Component } from "react";
import { subscribe } from "../sockets";
import { ON_CONNECTIONS_UPDATE, ON_POST_PUBLISH } from "../sockets/types";
import { get } from "../services/request.service";
import styled from "styled-components";

const Indicators = styled.div`
  margin-top: 40px;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
  }

  b {
    font-size: 18px;
    margin-right: 6px;
  }

  span {
    font-weight: 100;
    font-size: 13px;
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
