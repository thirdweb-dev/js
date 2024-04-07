import { describe, expect, it, vi } from "vitest";
import { createEmitter } from "./tiny-emitter.js";

describe("createEmitter", () => {
  it("should subscribe to an event and emit data", () => {
    const emitter = createEmitter<{ event1: string }>();
    const callback = vi.fn();

    const unsubscribe = emitter.subscribe("event1", callback);
    emitter.emit("event1", "test data");

    expect(callback).toHaveBeenCalledWith("test data");

    unsubscribe();
    emitter.emit("event1", "test data");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple subscribers for the same event", () => {
    const emitter = createEmitter<{ event1: string }>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    emitter.subscribe("event1", callback1);
    emitter.subscribe("event1", callback2);
    emitter.emit("event1", "test data");

    expect(callback1).toHaveBeenCalledWith("test data");
    expect(callback2).toHaveBeenCalledWith("test data");
  });

  it("should handle unsubscribing from an event", () => {
    const emitter = createEmitter<{ event1: string }>();
    const callback = vi.fn();

    const unsubscribe = emitter.subscribe("event1", callback);
    emitter.emit("event1", "test data");

    expect(callback).toHaveBeenCalledWith("test data");

    unsubscribe();
    emitter.emit("event1", "test data");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not throw an error when unsubscribing from a non-existent event", () => {
    const emitter = createEmitter<{ event1: string }>();
    const callback = vi.fn();

    const unsubscribe = emitter.subscribe("event1", callback);
    emitter.emit("event1", "test data");

    expect(callback).toHaveBeenCalledWith("test data");

    unsubscribe();
    // @ts-expect-error - testing for a non-existent event
    emitter.emit("event2", "test data");

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
