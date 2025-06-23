import { describe, expect, it, vi } from "vitest";
import { retry } from "./retry.js";

describe("retry", () => {
  it("should successfully resolve the promise without retries if no error is thrown", async () => {
    const mockFn = vi.fn().mockResolvedValue("success");
    await expect(retry(mockFn, { delay: 100, retries: 1 })).resolves.toBe(
      "success",
    );
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should retry the specified number of times on failure", async () => {
    const error = new Error("Test error");
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValue("success");

    await expect(retry(mockFn, { delay: 0, retries: 3 })).resolves.toBe(
      "success",
    );
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("should fail after exceeding the retry limit", async () => {
    const error = new Error("Persistent error");
    const mockFn = vi.fn().mockRejectedValue(error);

    await expect(retry(mockFn, { delay: 0, retries: 2 })).rejects.toThrow();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should respect the delay between retries", async () => {
    const error = new Error("Test error with delay");
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValue("success");

    const delay = 100;
    const startTime = Date.now();
    await retry(mockFn, { delay, retries: 3 });
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(2 * delay);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
