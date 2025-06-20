import { describe, expect, it } from "vitest";
import { getAllInBatches } from "./utils.js";

describe("getAllInBatches", () => {
  it("should handle range with multiple batches", async () => {
    const mockFnCalls: { start: bigint; end: bigint }[] = [];
    const mockFn = async (start: bigint, end: bigint) => {
      mockFnCalls.push({ end, start });
      return { end, start };
    };

    const options = {
      end: 20n,
      maxSize: 5n,
      start: 1n,
    };

    const result = await getAllInBatches(mockFn, options);

    expect(mockFnCalls.length).toEqual(4);
    expect(mockFnCalls[0]).toEqual({ end: 5n, start: 1n });
    expect(mockFnCalls[1]).toEqual({ end: 10n, start: 6n });
    expect(mockFnCalls[2]).toEqual({ end: 15n, start: 11n });
    expect(mockFnCalls[3]).toEqual({ end: 19n, start: 16n });

    expect(result).toEqual([
      { end: 5n, start: 1n },
      { end: 10n, start: 6n },
      { end: 15n, start: 11n },
      { end: 19n, start: 16n },
    ]);
  });

  it("should handle single batch", async () => {
    const mockFnCalls: { start: bigint; end: bigint }[] = [];
    const mockFn = async (start: bigint, end: bigint) => {
      mockFnCalls.push({ end, start });
      return { end, start };
    };

    const options = {
      end: 4n,
      maxSize: 10n,
      start: 1n,
    };

    const result = await getAllInBatches(mockFn, options);

    expect(mockFnCalls.length).toEqual(1);
    expect(mockFnCalls[0]).toEqual({ end: 3n, start: 1n });

    expect(result).toEqual([{ end: 3n, start: 1n }]);
  });
});
