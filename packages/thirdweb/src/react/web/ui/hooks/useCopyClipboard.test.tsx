import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "~test/react-render.js";
import { useClipboard } from "./useCopyClipboard.js";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should copy text to clipboard and set hasCopied to true", async () => {
    const { result } = renderHook(() => useClipboard("Hello World"));

    // Simulate copying text
    await act(async () => {
      await result.current.onCopy();
    });

    // Check if hasCopied is true after copying
    expect(result.current.hasCopied).toBe(true);
  });

  it("should reset hasCopied to false after 1.5 seconds", async () => {
    const { result } = renderHook(() => useClipboard("Hello World"));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(result.current.hasCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.hasCopied).toBe(false);
  });
});
