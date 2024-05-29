import { describe, expect, it, vi } from "vitest";
import { timeoutPromise } from "./timeoutPromise.js";

const options = {
  ms: 100,
  message: "Timeout",
};

describe("timeoutPromise", () => {
  it("should resolve if the promise resolves before the timeout", async () => {
    const mockPromise = new Promise((resolve) => {
      setTimeout(() => resolve("success"), 50);
    });
    const result = await timeoutPromise(mockPromise, options);
    expect(result).toBe("success");
  });

  it("should reject if the promise rejects before the timeout", async () => {
    const mockPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("failure")), 50);
    });

    try {
      await timeoutPromise(mockPromise, options);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("failure");
    }
  });

  it("rejects with the timeout message if the promise took longer than the allowed time", async () => {
    const mockPromise = new Promise((resolve) => {
      setTimeout(() => resolve("success"), 1000);
    });

    try {
      await timeoutPromise(mockPromise, options);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Timeout");
    }
  });

  it("cleans up the timeout when the promise resolves", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const mockPromise = new Promise((resolve) => {
      setTimeout(() => resolve("success"), 50);
    });
    await timeoutPromise(mockPromise, options);
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("cleans up the timeout when the promise rejects", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const mockPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("failure")), 50);
    });
    try {
      await timeoutPromise(mockPromise, options);
    } catch (error) {}
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
