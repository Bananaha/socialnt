import tempService from "./temp.service";

describe("temp service", () => {
  describe("add", () => {
    it("devrait faire la somme des deux arguments passés", () => {
      expect(tempService.add(1, 2)).toBe(3);
      expect(tempService.add(8, 9)).toBe(17);
    });
  });

  describe("callbackFn", () => {
    const mock = jest.fn();
    tempService.callbackFn(mock);
    expect(mock).toHaveBeenCalled();
  });

  describe("multiply", () => {
    it("should multiply arguments", () => {
      expect(tempService.multiply(3, 2)).toBe(6);
    });

    describe("when no arguments, should return 0)", () => {
      expect(tempService.multiply()).toBe(0);
    });
  });
});
