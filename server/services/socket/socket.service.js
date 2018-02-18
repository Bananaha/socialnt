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
            socketItem.user = {
              _id: result.user,
              profile: result.profile
            };
          })
          .catch(error => {
            socket.disconnect();
          });
      }

      socketActions.attachDispatcher(socketItem, { emit, emitForUsers });
    });

    socket.on("disconnect", () => {
      sockets = sockets.filter(socketItem => socketItem.socket !== socket);
      emit("ON_CONNECTIONS_UPDATE", { connectionsCount: sockets.length });
    });
  });
};

const emit = (event, payload, filter) => {
  const filteredSockets = filter ? sockets.filter(filter) : sockets;
  console.log("EMIT", event, payload);
  filteredSockets.forEach(socketItem => socketItem.socket.emit(event, payload));
};

const emitForAdmin = (event, payload) => {
  emit(event, payload, socketItem => socketItem.user.profile === "ADMIN");
};

const emitForUsers = (event, payload, users) => {
  emit(
    event,
    payload,
    socketItems => users.indexOf(socketItems.user._id.toString()) !== -1
  );
};

const nbConnectedUsers = () => {
  return sockets.length;
};

module.exports = {
  onConnection,
  emit,
  emitForUsers,
  nbConnectedUsers
};
