import { describe, expect, it } from "vitest";
import { getAllInBatches } from "./utils.js";

describe("getAllInBatches", () => {
  it("should handle range with multiple batches", async () => {
    const mockFnCalls: { start: bigint; end: bigint }[] = [];
    const mockFn = async (start: bigint, end: bigint) => {
      mockFnCalls.push({ start, end });
      return { start, end };
    };

    const options = {
      start: 1n,
      end: 20n,
      maxSize: 5n,
    };

    const result = await getAllInBatches(mockFn, options);

    expect(mockFnCalls.length).toEqual(4);
    expect(mockFnCalls[0]).toEqual({ start: 1n, end: 5n });
    expect(mockFnCalls[1]).toEqual({ start: 6n, end: 10n });
    expect(mockFnCalls[2]).toEqual({ start: 11n, end: 15n });
    expect(mockFnCalls[3]).toEqual({ start: 16n, end: 19n });

    expect(result).toEqual([
      { start: 1n, end: 5n },
      { start: 6n, end: 10n },
      { start: 11n, end: 15n },
      { start: 16n, end: 19n },
    ]);
  });

  it("should handle single batch", async () => {
    const mockFnCalls: { start: bigint; end: bigint }[] = [];
    const mockFn = async (start: bigint, end: bigint) => {
      mockFnCalls.push({ start, end });
      return { start, end };
    };

    const options = {
      start: 1n,
      end: 4n,
      maxSize: 10n,
    };

    const result = await getAllInBatches(mockFn, options);

    expect(mockFnCalls.length).toEqual(1);
    expect(mockFnCalls[0]).toEqual({ start: 1n, end: 3n });

    expect(result).toEqual([{ start: 1n, end: 3n }]);
  });
});
