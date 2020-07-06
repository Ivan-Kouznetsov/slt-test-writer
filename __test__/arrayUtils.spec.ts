import * as arrayUtils from "../util/arrayUtils";

describe("Array utils tests", () => {
  it("should get types of array items", () => {
    expect(
      arrayUtils.getTypesOfArrayItems([1, 1, "", "", false, undefined, {}])
    ).toEqual(["number", "string", "boolean", "undefined", "object"]);
  });

  it("should get range of array items", () => {
    expect(arrayUtils.getRange([2, 3, 4, 17])).toEqual({ start: 2, end: 17 });
  });

  it("should get range of array items", () => {
    expect(arrayUtils.hasEmptyStrings(["", "hello"])).toBe(true);
    expect(arrayUtils.hasEmptyStrings(["hi", "hello"])).toBe(false);
  });

  it("should check if all values are the same in an array", () => {
    expect(arrayUtils.alwaysSameValue([1, 1, 1, 1, 1, 1])).toBe(true);
    expect(arrayUtils.alwaysSameValue([1, 0, 1, 1, 1, 1])).toBe(false);
  });
});
