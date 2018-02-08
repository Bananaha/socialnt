const messageService = require("../message.service");

const TYPES = {
  REFRESH_STATS: "REFRESH_STATS"
};

const attachDispatcher = (socket, io) => {
  Object.keys(TYPES).forEach(eventType => {
    socket.on(eventType, payload => {
      dispatchSocketEvent(eventType, socket, io, payload);
    });
    socket.emit(eventType, () => {
      dispatchSocketEvent(eventType, socket, io, payload);
    });
  });
};

const dispatchSocketEvent = (eventType, socket, io, payload) => {
  switch (eventType) {
    case TYPES.REFRESH_STATS:
      return refreshStats(socket);
      break;
  }
};

const refreshStats = socket => {
  messageService.countMessages().then(result => {
    socket.emit(TYPES.REFRESH_STATS, { result });
  });
};

module.exports = {
  attachDispatcher
};
