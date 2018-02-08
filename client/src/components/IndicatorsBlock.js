import React, { Component } from "react";
import { subscribe } from "../sockets";

class IndicatorsBlock extends Component {
  state = {
    nbConnectedUsers: "",
    nbPublishedMessages: ""
  };
  componentDidMount() {
    subscribe("");
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
