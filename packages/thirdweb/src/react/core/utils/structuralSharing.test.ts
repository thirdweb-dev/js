import { describe, expect, it } from "vitest";
import { structuralSharing } from "./structuralSharing.js";

describe("structuralSharing", () => {
  it("should return the old data if it is deeply equal to the new data", () => {
    const oldData = { a: 1, b: { c: 2 } };
    const newData = { a: 1, b: { c: 2 } };
    const result = structuralSharing(oldData, newData);
    expect(result).toBe(oldData);
  });

  it("should return a new object with shared structure for equal parts", () => {
    const oldData = { a: 1, b: { c: 2 }, d: 3 };
    const newData = { a: 1, b: { c: 2 }, d: 4 };
    const result = structuralSharing(oldData, newData);
    expect(result).not.toBe(oldData);
    expect(result).not.toBe(newData);
    expect(result.a).toBe(oldData.a);
    expect(result.b).toBe(oldData.b);
    expect(result.d).toBe(newData.d);
  });

  it("should handle arrays correctly", () => {
    const oldData = [1, 2, [3, 4]];
    const newData = [1, 2, [3, 5]];
    const result = structuralSharing(oldData, newData);
    expect(result).not.toBe(oldData);
    expect(result).not.toBe(newData);
    expect(result[0]).toBe(oldData[0]);
    expect(result[1]).toBe(oldData[1]);
    expect(result[2]).not.toBe(oldData[2]);
  });

  it("should handle undefined oldData", () => {
    const oldData = undefined;
    const newData = { a: 1 };
    const result = structuralSharing(oldData, newData);
    expect(result).toBe(newData);
  });

  it("should handle NaN values correctly", () => {
    const oldData = { a: Number.NaN };
    const newData = { a: Number.NaN };
    const result = structuralSharing(oldData, newData);
    expect(result).toBe(oldData);
  });

  it("should handle objects with different constructors", () => {
    class CustomClass {}
    const oldData = new CustomClass();
    const newData = { a: 1 };
    const result = structuralSharing(oldData, newData);
    expect(result).toBe(newData);
  });
});
