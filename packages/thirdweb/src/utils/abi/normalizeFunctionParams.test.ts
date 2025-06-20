import type { AbiFunction } from "abitype";
import { describe, expect, it, vi } from "vitest";
import { parseAbiParams } from "../contract/parse-abi-params.js";
import { normalizeFunctionParams } from "./normalizeFunctionParams.js";

vi.mock("../contract/parse-abi-params.js", () => {
  return {
    parseAbiParams: vi.fn((_types, values) => values),
  };
});

describe("normalizeFunctionParams", () => {
  it("should return an empty array when abiFunction is undefined", () => {
    const result = normalizeFunctionParams(undefined, {});
    expect(result).toEqual([]);
  });

  it("should normalize and return function parameters correctly", () => {
    const abiFunction: AbiFunction = {
      inputs: [
        { name: "_param1", type: "uint256" },
        { name: "_param2", type: "string" },
      ],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };
    const params = {
      param1: 123,
      param2: "hello",
    };

    const result = normalizeFunctionParams(abiFunction, params);
    expect(result).toEqual([123, "hello"]);
  });

  it("should handle parameter names with underscores", () => {
    const abiFunction: AbiFunction = {
      inputs: [
        { name: "_param1", type: "uint256" },
        { name: "_param2", type: "string" },
      ],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };
    const params = {
      _param1: 123,
      param2: "hello",
    };

    const result = normalizeFunctionParams(abiFunction, params);
    expect(result).toEqual([123, "hello"]);
  });

  it("should throw an error if a parameter name is missing", () => {
    let abiFunction: AbiFunction = {
      inputs: [{ name: undefined, type: "uint256" }],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };

    expect(() => normalizeFunctionParams(abiFunction, {})).toThrow(
      "Missing named parameter for test at index 0",
    );

    abiFunction = {
      inputs: [{ name: "", type: "uint256" }],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };

    expect(() => normalizeFunctionParams(abiFunction, {})).toThrow(
      "Missing named parameter for test at index 0",
    );

    abiFunction = {
      inputs: [{ name: undefined, type: "uint256" }],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };

    const normalized = normalizeFunctionParams(abiFunction, { "*": 123 });

    expect(normalized.length).to.eq(1);
    expect(normalized[0]).to.eq(123);
  });

  it("should throw an error if a parameter value is missing", () => {
    const abiFunction: AbiFunction = {
      inputs: [{ name: "_param1", type: "uint256" }],
      name: "testFunction",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };

    expect(() => normalizeFunctionParams(abiFunction, {})).toThrow(
      "Missing value for parameter _param1 at index 0",
    );
  });

  it("should call parseAbiParams with the correct arguments", () => {
    const abiFunction: AbiFunction = {
      inputs: [
        { name: "_param1", type: "uint256" },
        { name: "_param2", type: "string" },
      ],
      name: "test",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    };
    const params = {
      param1: 123,
      param2: "hello",
    };

    normalizeFunctionParams(abiFunction, params);
    expect(parseAbiParams).toHaveBeenCalledWith(
      ["uint256", "string"],
      [123, "hello"],
    );
  });
});
