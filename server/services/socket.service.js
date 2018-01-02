const eventTypes = {
  refreshStat: "refreshStat"
};

const attachDispatcher = (socket, io) => {
  Object.keys(eventTypes).forEach(eventType => {
    socket.on(eventType, payload => {
      dispatchSocketEvent(eventType, socket, io, payload);
    });
  });
};

const dispatchSocketEvent = (eventType, socket, io, payload) => {
  switch (eventType) {
    case eventTypes.refreshStat:
      return refreshStat();
      breack;
  }
};

const refreshStat = () => {
  console.log("toto");
};

module.exports = io => {
  console.log("in socket services");

  io.on("connection", socket => {
    console.log("WS CONNECT");
    attachDispatcher(socket, io);
  });
};
