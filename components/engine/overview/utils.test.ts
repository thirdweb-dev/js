/**
 * @jest-environment node
 */

import { prettyPrintCurrency } from "../utils";

describe("prettyPrintCurrency", () => {
  it("Given undefined amount", () => {
    const actual = prettyPrintCurrency({
      amount: undefined,
      symbol: "MATIC",
    });
    expect(actual).toEqual("0.000000 MATIC");
  });
  it("Given string amount", () => {
    const actual = prettyPrintCurrency({
      amount: "0.1234",
      symbol: "MATIC",
    });
    expect(actual).toEqual("0.123400 MATIC");
  });
  it("Given number amount", () => {
    const actual = prettyPrintCurrency({
      amount: 0.12345678,
      symbol: "MATIC",
    });
    expect(actual).toEqual("0.123457 MATIC");
  });
});
