import { beforeEach, describe, expect, it } from "vitest";
import { consumeRedirectState, storeRedirectState } from "./redirect-state.js";

describe.runIf(typeof window !== "undefined")("redirect-state", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("accepts the exact state it stored", async () => {
    const state = await storeRedirectState();
    expect(await consumeRedirectState(state)).toBe(true);
  });

  it("rejects a mismatched state", async () => {
    await storeRedirectState();
    expect(await consumeRedirectState("not-the-stored-state")).toBe(false);
  });

  it("rejects an undefined returned state", async () => {
    await storeRedirectState();
    expect(await consumeRedirectState(undefined)).toBe(false);
  });

  it("rejects when nothing was stored", async () => {
    expect(await consumeRedirectState("anything")).toBe(false);
  });

  it("is single-use: a valid state cannot be replayed", async () => {
    const state = await storeRedirectState();
    expect(await consumeRedirectState(state)).toBe(true);
    expect(await consumeRedirectState(state)).toBe(false);
  });

  it("clears the stored value even on a mismatch", async () => {
    const state = await storeRedirectState();
    // a wrong attempt still consumes the stored value...
    expect(await consumeRedirectState("wrong")).toBe(false);
    // ...so the real value can no longer be used either
    expect(await consumeRedirectState(state)).toBe(false);
  });
});
