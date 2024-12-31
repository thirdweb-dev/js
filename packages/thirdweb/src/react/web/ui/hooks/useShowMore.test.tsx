import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "~test/react-render.js";
import { useShowMore } from "./useShowMore.js";

describe("useShowMore", () => {
  it("should initialize with the correct number of items to show", () => {
    const { result } = renderHook(() => useShowMore(5, 3));
    expect(result.current.itemsToShow).toBe(5);
  });

  it("should increase itemsToShow when the last item comes into view", () => {
    const { result } = renderHook(() => useShowMore(5, 3));

    // Simulate the last item coming into view
    const lastItem = document.createElement("div");
    const observerCallback = vi.fn();

    const observer = new IntersectionObserver(observerCallback);
    vi.spyOn(window, "IntersectionObserver").mockImplementation((callback) => {
      observerCallback.mockImplementation(callback);
      return observer;
    });

    act(() => {
      result.current.lastItemRef(lastItem);
      observerCallback([{ isIntersecting: true }]); // Simulate intersection
    });

    expect(result.current.itemsToShow).toBe(8); // 5 + 3
  });

  it("should not increase itemsToShow if the last item is not in view", () => {
    const { result } = renderHook(() => useShowMore(5, 3));

    // Simulate the last item not coming into view
    const lastItem = document.createElement("div");

    const observerCallback = vi.fn();

    const observer = new IntersectionObserver(observerCallback);
    vi.spyOn(window, "IntersectionObserver").mockImplementation((callback) => {
      observerCallback.mockImplementation(callback);
      return observer;
    });

    act(() => {
      result.current.lastItemRef(lastItem);
      observerCallback([{ isIntersecting: false }]); // Simulate no intersection
    });

    expect(result.current.itemsToShow).toBe(5); // Should remain unchanged
  });

  it("should handle multiple intersections correctly", () => {
    const { result } = renderHook(() => useShowMore(5, 3));

    // Simulate the last item coming into view multiple times
    const lastItem = document.createElement("div");

    const observerCallback = vi.fn();

    const observer = new IntersectionObserver(observerCallback);
    vi.spyOn(window, "IntersectionObserver").mockImplementation((callback) => {
      observerCallback.mockImplementation(callback);
      return observer;
    });

    act(() => {
      result.current.lastItemRef(lastItem);

      // First intersection
      observerCallback([{ isIntersecting: true }]);

      // Second intersection
      observerCallback([{ isIntersecting: true }]);

      // Third intersection
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.itemsToShow).toBe(14); // 5 + (3 * 3)
  });
});
