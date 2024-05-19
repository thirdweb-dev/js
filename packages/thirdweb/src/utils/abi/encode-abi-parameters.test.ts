import { describe, expect, it } from "vitest";
import { encodeAbiParameters, prepareParam } from "./encodeAbiParameters.js";

describe("encodeAbiParameters", () => {
  it("should throw an error if params.length !== values.length", async () => {
    const params = [
      { name: "param1", type: "uint256" },
      { name: "param2", type: "string" },
    ];
    const values = [123, "hello", "this should not be here"];
    expect(() => encodeAbiParameters(params, values)).toThrowError(
      "The number of parameters and values must match.",
    );
  });

  it("should throw an error with unsupported parameter type", () => {
    const param = { name: "param1", type: "some-unknown-type" };
    const value = [""];
    expect(() => prepareParam({ param, value })).toThrowError(
      "Unsupported parameter type",
    );
  });
});
