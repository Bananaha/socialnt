import fetchMock from "jest-fetch-mock";

global.fetch = fetchMock;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
// global.localStorage = localStorageMock;
