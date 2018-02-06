const dbService = require("../services/db.service");
const ObjectId = require("mongodb").ObjectID;

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
  return dbService
    .findAndCount("messages", {})
    .then(nbMessages => {
      console.log(nbMessages);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = io => {
  console.log("in socket services");

  io.on("connection", socket => {
    console.log("WS CONNECT");
    attachDispatcher(socket, io);
  });
};
