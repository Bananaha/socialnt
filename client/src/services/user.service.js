import { post } from "./request.service";
import { emit } from "../sockets";
import TYPES from "../sockets/types";

const onResult = response => {
  localStorage.setItem("token", response.token);
  emit(TYPES.USER_INFO, response.token);
  return response;
};

export const login = credentials => {
  return post("/login", credentials).then(onResult);
};

export const signing = newUser => {
  return post("/login/newUser", newUser).then(onResult);
};
