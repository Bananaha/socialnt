"use strict";

const socketActions = require("./socket.action");
const tokenService = require("../token.service");
const userService = require("../user.service");
let sockets = [];

const cleanFriend = friend => ({
  id: friend._id,
  pseudo: friend.pseudo
});

const updateUserInfo = (socketItem, token) => {
  if (!token) {
    socketItem.socket.emit("USER_INFO", {
      profile: "visitor"
    });
    socketItem.user = {
      _id: undefined,
      profile: "visitor"
    };
    return;
  }
  tokenService
    .verifyToken(token)
    .then(result => {
      return userService.findByIdWithFriends(result.user);
    })
    .then(user => {
      socketItem.user = {
        _id: user._id,
        profile: user.profile
      };
      socketItem.socket.emit("USER_INFO", {
        profile: user.profile,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        pseudo: user.pseudo,
        email: user.email,
        friends: user.friends.map(cleanFriend)
      });
    })
    .catch(error => {
      socket.disconnect();
    });
};

const onConnection = io => {
  io.on("connection", socket => {
    const socketItem = {
      socket,
      user: {
        profile: "visitor"
      }
    };

    sockets.push(socketItem);
    const nbConnectedUsers = sockets.filter(
      socket => socket.user.profile !== "visitor"
    );
    emit("ON_CONNECTIONS_UPDATE", {
      connectionsCount: nbConnectedUsers.length
    });

    socket.on("USER_INFO", token => {
      updateUserInfo(socketItem, token);
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
