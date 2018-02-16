const chatService = require("../chat.service");

const TYPES = {
  SEND_CHAT_MESSAGE: "SEND_CHAT_MESSAGE"
};

const attachDispatcher = (socketItem, socketCallbacks) => {
  Object.keys(TYPES).forEach(eventType => {
    socketItem.socket.on(eventType, payload => {
      dispatchSocketEvent(eventType, socketItem, payload, socketCallbacks);
    });
  });
};

const dispatchSocketEvent = (
  eventType,
  socketItem,
  payload,
  socketCallbacks
) => {
  switch (eventType) {
    case TYPES.SEND_CHAT_MESSAGE:
      chatService
        .addMessage(payload.conversationId, payload.message, socketItem.user)
        .then(result => {
          socketCallbacks.emitForUsers(
            "ON_CHAT_MESSAGE",
            result.message,
            result.users.map(id => id.toString())
          );
        });
      break;

    default:
      break;
  }
};

const nbConnectedUsers = (socket, io) => {
  console.log("toto");
};

module.exports = {
  attachDispatcher
};
