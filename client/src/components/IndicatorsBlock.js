import React, { Component } from "react";
import openSocket from "socket.io-client";

class IndicatorsBlock extends Component {
  componentDidMount() {
    const socket = openSocket("http://localhost:5000");
    socket.emit("refreshStat");
  }
  render() {
    return (
      <div>
        <div>
          <p>Nombre de messages postés</p>
          <span>12</span>
        </div>
        <div>
          <p>Nombre de membres connectés</p>
          <span>5</span>
        </div>
      </div>
    );
  }
}

export default IndicatorsBlock;
