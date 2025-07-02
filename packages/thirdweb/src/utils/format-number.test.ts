import { expect, test } from "vitest";
import { formatNumber, numberToPlainString } from "./formatNumber.js";

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

test("numberToPlainString", () => {
  // Numbers without exponential notation (should return as-is)
  expect(numberToPlainString(123)).toEqual("123");
  expect(numberToPlainString(0.123)).toEqual("0.123");
  expect(numberToPlainString(0)).toEqual("0");
  expect(numberToPlainString(-456)).toEqual("-456");
  expect(numberToPlainString(-0.789)).toEqual("-0.789");

  // Small numbers with negative exponents
  expect(numberToPlainString(1e-1)).toEqual("0.1");
  expect(numberToPlainString(1e-2)).toEqual("0.01");
  expect(numberToPlainString(1e-3)).toEqual("0.001");
  expect(numberToPlainString(1.23e-4)).toEqual("0.000123");
  expect(numberToPlainString(1.2345e-6)).toEqual("0.0000012345");
  expect(numberToPlainString(5e-10)).toEqual("0.0000000005");
  expect(numberToPlainString(-5e-10)).toEqual("-0.0000000005");

  // Large numbers with positive exponents - zerosNeeded >= 0
  expect(numberToPlainString(1e1)).toEqual("10");
  expect(numberToPlainString(1e2)).toEqual("100");
  expect(numberToPlainString(1.23e3)).toEqual("1230");
  expect(numberToPlainString(1.23e5)).toEqual("123000");
  expect(numberToPlainString(5.67e10)).toEqual("56700000000");

  // Large numbers with positive exponents - zerosNeeded < 0 (decimal point insertion)
  expect(numberToPlainString(1.2345e2)).toEqual("123.45");
  expect(numberToPlainString(1.23e1)).toEqual("12.3");
  expect(numberToPlainString(9.876e2)).toEqual("987.6");
  expect(numberToPlainString(1.23456e3)).toEqual("1234.56");
  expect(numberToPlainString(5.4321e1)).toEqual("54.321");

  // Edge cases where exponent equals decimal length
  expect(numberToPlainString(1.23e2)).toEqual("123");
  expect(numberToPlainString(1.234e3)).toEqual("1234");

  // Negative numbers
  expect(numberToPlainString(-1.2345e2)).toEqual("-123.45");
  expect(numberToPlainString(-1.23e-4)).toEqual("-0.000123");

  // Very large numbers (JavaScript precision limits apply)
  expect(numberToPlainString(1.0523871386385944e21)).toEqual(
    "1052387138638594400000",
  );

  // Numbers that would normally show exponential notation
  expect(numberToPlainString(0.0000001)).toEqual("0.0000001");
  expect(numberToPlainString(10000000)).toEqual("10000000");
});
