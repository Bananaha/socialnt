import React, { Component } from "react";
import { subscribe } from "../sockets";
import { ON_CONNECTIONS_UPDATE, ON_POST_PUBLISH } from "../sockets/types";
import { get } from "../services/request.service";

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
    return (
      <div>
        <div>
          <p>Nombre de posts publiés</p>
          <span>{this.state.nbPublishedPosts}</span>
        </div>
        <div>
          <p>Nombre de membres connectés</p>
          <span>{this.state.nbConnectedUsers}</span>
        </div>
      </div>
    );
  }
}

export default IndicatorsBlock;
