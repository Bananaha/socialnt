import { post } from "./request.service";

export const add = (num1, num2) => num1 + num2;

export const callbackFn = fn => {
  fn();
};

export const multiply = (num1 = 0, num2 = 0) => num1 * num2;

export default {
  add,
  callbackFn,
  multiply
};
