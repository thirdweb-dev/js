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

  it("leaves a pending state intact after a mismatched attempt", async () => {
    const state = await storeRedirectState();
    // a wrong attempt must NOT consume the legitimate pending state
    expect(await consumeRedirectState("wrong")).toBe(false);
    // ...so the real callback still validates when it returns
    expect(await consumeRedirectState(state)).toBe(true);
  });

  it("supports concurrent flows without clobbering each other", async () => {
    const first = await storeRedirectState();
    const second = await storeRedirectState();
    expect(first).not.toBe(second);
    // both flows validate independently, in any order
    expect(await consumeRedirectState(second)).toBe(true);
    expect(await consumeRedirectState(first)).toBe(true);
  });

  it("a forged/unknown consume cannot evict other pending flows", async () => {
    const first = await storeRedirectState();
    const second = await storeRedirectState();
    // an attacker-supplied state only ever touches its own (absent) key
    expect(await consumeRedirectState("forged-state-value")).toBe(false);
    // ...so both legitimate flows still validate
    expect(await consumeRedirectState(first)).toBe(true);
    expect(await consumeRedirectState(second)).toBe(true);
  });

  it("rejects an expired state", async () => {
    window.localStorage.setItem(
      "thirdweb:auth-redirect-state:stale",
      String(Date.now() - 1000),
    );
    expect(await consumeRedirectState("stale")).toBe(false);
  });

  it("rejects a state whose stored expiry is malformed", async () => {
    window.localStorage.setItem(
      "thirdweb:auth-redirect-state:garbage",
      "not-a-number",
    );
    expect(await consumeRedirectState("garbage")).toBe(false);
  });

  it("prunes expired states on the next store", async () => {
    const staleKey = "thirdweb:auth-redirect-state:old";
    window.localStorage.setItem(staleKey, String(Date.now() - 1000));
    await storeRedirectState();
    expect(window.localStorage.getItem(staleKey)).toBeNull();
  });

  it("no-ops safely when localStorage is unavailable", async () => {
    const realLocalStorage = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("localStorage blocked");
      },
    });
    try {
      // store still returns a state, and consume reports false rather than throwing
      expect(typeof (await storeRedirectState())).toBe("string");
      expect(await consumeRedirectState("anything")).toBe(false);
    } finally {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: realLocalStorage,
        writable: true,
      });
    }
  });
});
