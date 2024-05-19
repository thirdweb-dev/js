import { describe, expect, it } from "vitest";
import { encodeAbiParameters } from "./encodeAbiParameters.js";

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
});
