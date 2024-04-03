import { describe, expect, it } from "vitest";
import { wait } from "./wait.js";

describe("wait", () => {
  it("should wait for the specified time", async () => {
    const start = Date.now();
    const ms = 1000; // 1 second
    await wait(ms);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(ms);
  });
});
