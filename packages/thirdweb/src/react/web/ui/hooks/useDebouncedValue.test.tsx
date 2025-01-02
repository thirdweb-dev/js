import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "~test/react-render.js";
import { useDebouncedValue } from "./useDebouncedValue.js";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 1000));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 1000 } },
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "changed", delay: 1000 });

    // The value should not change immediately
    expect(result.current).toBe("initial");

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // The value should still not have changed
    expect(result.current).toBe("initial");

    // Fast-forward time to just before the delay
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // The value should still not have changed
    expect(result.current).toBe("initial");

    // Fast-forward time to the full delay
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Now the value should have changed
    expect(result.current).toBe("changed");
  });

  it("should handle multiple rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 1000 } },
    );

    rerender({ value: "change1", delay: 1000 });
    rerender({ value: "change2", delay: 1000 });
    rerender({ value: "change3", delay: 1000 });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("change3");
  });

  it("should respect changing delay times", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 1000 } },
    );

    rerender({ value: "changed", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current).toBe("changed");
  });

  it("should cancel debounce on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useDebouncedValue("initial", 1000),
    );

    expect(result.current).toBe("initial");

    act(() => {
      unmount();
      vi.advanceTimersByTime(1000);
    });

    // The value should remain 'initial' as the effect should have been cleaned up
    expect(result.current).toBe("initial");
  });
});
