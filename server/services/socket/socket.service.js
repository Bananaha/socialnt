const socketActions = require("./socket.actions");

const sockets = [];

const onConnection = io => {
  io.on("connection", socket => {
    console.log("WS CONNECTION DETECteD");
    const socketItem = {
      socket,
      user: {
        profile: "VISITOR"
      }
    };
    sockets.push(socketItem);
    socketActions.attachDispatcher(socket, io);

    socket.on("USER_INFO", token => {
      // check token
      // if token bad, close ws
      // get user
      // socketItem.user = { profile: 'XXX', id: '123' }
    });
  });
};

const emit = (event, payload, filter) => {
  sockets
    .filter(filter)
    .forEach(socketItem => socketItem.socket.emit(event, payload));
};

const emitForAdmin = (event, payload) => {
  emit(event, payload, socketItem => socketItem.user.profile === "ADMIN");
};

const emitForUsers = (event, payload, users) => {
  emit(event, payload, socketItem => users.indexOf(socketItem.user.id) !== -1);
};

module.exports = {
  onConnection,
  emit
};
