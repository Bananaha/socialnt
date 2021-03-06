import openSocket from "socket.io-client";
import TYPES from "./types";

let socket;
const token = localStorage.getItem("token");
const subscribers = {};

export const subscribe = (eventName, eventCb) => {
  if (!subscribers[eventName]) {
    subscribers[eventName] = [];
  }

  subscribers[eventName].push(eventCb);

  return () => {
    subscribers[eventName] = subscribers[eventName].filter(
      cb => cb !== eventCb
    );
  };
};

export const emit = (event, payload) => {
  if (!socket) {
    return;
  }
  socket.emit(event, payload);
};

export const connect = () => {
  socket = openSocket(process.env.REACT_APP_HOST);
  socket.emit(TYPES.USER_INFO, token);

  Object.values(TYPES).forEach(eventType => {
    socket.on(eventType, payload => {
      if (!subscribers[eventType]) {
        return;
      }
      subscribers[eventType].forEach(cb => {
        cb(payload);
      });
    });
  });
};
