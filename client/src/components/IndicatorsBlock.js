import React, { Component } from "react";
import { subscribe } from "../sockets";
import { ON_CONNECTIONS_UPDATE, ON_POST_PUBLISH } from "../sockets/types";
import { get } from "../services/request.service";
import "../styles/IndicatorsBlock.css";

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
      <div className="IndicatorsBlock">
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
      </div>
    );
  }
}

export default IndicatorsBlock;
