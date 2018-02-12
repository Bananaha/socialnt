import React, { Component } from "react";
import { subscribe, connect, emit } from "../sockets";
import { ON_CONNECTIONS_UPDATE, ON_MESSAGE_PUBLISH } from "../sockets/types";
import { get } from "../services/request.service";

class IndicatorsBlock extends Component {
  state = {
    nbConnectedUsers: "",
    nbPublishedMessages: ""
  };

  messagePublishSub = undefined;
  connectionsUpdateSub = undefined;

  listenSocketEvents() {
    this.messagePublishSub = subscribe(ON_MESSAGE_PUBLISH, payload => {
      this.setState({ nbPublishedMessages: payload.messagesCounts });
    });

    this.connectionsUpdateSub = subscribe(ON_CONNECTIONS_UPDATE, payload => {
      console.log("- received connections update", payload);
      this.setState({ nbConnectedUsers: payload.connectionsCount });
    });
  }

  componentDidMount() {
    get("/message").then(result => {
      console.log(result);
      this.setState({
        nbPublishedMessages: result.nbMessages,
        nbConnectedUsers: result.nbConnectedUsers
      });
    });
    this.listenSocketEvents();
  }

  componentWillUnmount() {
    this.messagePublishSub();
    this.connectionsUpdateSub();
  }

  render() {
    return (
      <div>
        <div>
          <p>Nombre de messages postés</p>
          <span>{this.state.nbPublishedMessages}</span>
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
