"use strict";

const socketActions = require("./socket.action");
const tokenService = require("../token.service");
let sockets = [];

const onConnection = io => {
  io.on("connection", socket => {
    console.log("WS CONNECTION DETECteD");
    const socketItem = {
      socket,
      __user: {
        profile: "VISITOR"
      }
    };

    sockets.push(socketItem);

    emit("ON_CONNECTIONS_UPDATE", { connectionsCount: sockets.length });

    socket.on("USER_INFO", token => {
      if (token) {
        tokenService
          .verifyToken(token)
          .then(result => {
            socketItem.user = result;
          })
          .catch(error => {
            socket.disconnect();
          });
      }

      socketActions.attachDispatcher(socket, io);
    });

    socket.on("disconnect", () => {
      sockets = sockets.filter(socketItem => socketItem.socket !== socket);
      emit("ON_CONNECTIONS_UPDATE", { connectionsCount: sockets.length });
    });
  });
};

const emit = (event, payload, filter) => {
  const filteredSockets = filter ? sockets.filter(filter) : sockets;

  filteredSockets.forEach(socketItem => socketItem.socket.emit(event, payload));
};

const emitForAdmin = (event, payload) => {
  emit(event, payload, socketItem => socketItem.user.profile === "ADMIN");
};

const emitForUsers = (event, payload, users) => {
  emit(event, payload, socketItem => users.indexOf(socketItem.user.id) !== -1);
};

const nbConnectedUsers = () => {
  return sockets.length;
};

module.exports = {
  onConnection,
  emit,
  nbConnectedUsers
};
