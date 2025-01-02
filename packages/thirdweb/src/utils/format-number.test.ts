import { expect, test } from "vitest";
import { formatNumber } from "./formatNumber.js";

test("formatNumber", () => {
  // no decimals
  expect(formatNumber(0, 1)).toEqual(0);
  expect(formatNumber(0, 3)).toEqual(0);
  expect(formatNumber(10, 1)).toEqual(10);
  expect(formatNumber(10, 3)).toEqual(10);

  // no change
  expect(formatNumber(0.002, 3)).toEqual(0.002);
  expect(formatNumber(0.007, 3)).toEqual(0.007);
  expect(formatNumber(10.123, 3)).toEqual(10.123);

  // rounded
  expect(formatNumber(10.12345, 1)).toEqual(10.1);
  expect(formatNumber(10.49, 1)).toEqual(10.5);
  expect(formatNumber(0.12345, 1)).toEqual(0.1);
  expect(formatNumber(0.16345, 1)).toEqual(0.2);
  expect(formatNumber(0.16345, 3)).toEqual(0.163);
  expect(formatNumber(0.16395, 3)).toEqual(0.164);
  expect(formatNumber(1.0000000005, 3)).toEqual(1);

  // ceil-ed to avoid making value zero
  expect(formatNumber(0.0004, 3)).toEqual(0.001);
  expect(formatNumber(0.00000000000009, 3)).toEqual(0.001);
  expect(formatNumber(0.00000000000001, 3)).toEqual(0.001);
});
