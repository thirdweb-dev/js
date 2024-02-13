import { describe, it, expect } from "vitest";
import { resolvePromisedValue } from "./resolve-promised-value.js";

describe("resolvePromisedValue", () => {
  it("should resolve a promised value", async () => {
    const value = Promise.resolve("Hello, World!");
    const resolvedValue = await resolvePromisedValue(value);
    expect(resolvedValue).toBe("Hello, World!");
  });

  it("should resolve a function that returns a promised value", async () => {
    const value = () => Promise.resolve("Hello, World!");
    const resolvedValue = await resolvePromisedValue(value);
    expect(resolvedValue).toBe("Hello, World!");
  });

  it("should resolve a non-promised value", async () => {
    const value = "Hello, World!";
    const resolvedValue = await resolvePromisedValue(value);
    expect(resolvedValue).toBe("Hello, World!");
  });
});
