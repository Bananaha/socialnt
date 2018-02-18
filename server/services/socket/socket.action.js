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
          const users = result.users.map(id => id.toString());
          const response = {
            message: result.message,
            conversationId: payload.conversationId
          };
          socketCallbacks.emitForUsers(
            "ON_CHAT_MESSAGE",
            response,
            result.users.map(id => id.toString())
          );
        })
        .catch(error => {
          console.log("dispatchSocketEvent socket action", error);
        });
      break;

    default:
      break;
  }
};

module.exports = {
  attachDispatcher
};
