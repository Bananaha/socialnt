const TYPES = {};

const attachDispatcher = (socket, io) => {
  Object.keys(TYPES).forEach(eventType => {
    socket.on(eventType, payload => {
      dispatchSocketEvent(eventType, socket, io, payload);
    });
  });
};

const dispatchSocketEvent = (eventType, socket, io, payload) => {};

const nbConnectedUsers = (socket, io) => {
  console.log("toto");
};

module.exports = {
  attachDispatcher
};
