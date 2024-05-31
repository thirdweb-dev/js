import { describe, expect, it } from "vitest";
import { wait } from "./wait.js";

describe("wait", () => {
  it("should wait", async () => {
    const start = Date.now();
    const waitTime = 1500;
    await wait(waitTime);
    const end = Date.now();
    const elapsedTime = end - start;
    expect(elapsedTime).toBeGreaterThanOrEqual(waitTime);
  });
});
