import { describe, expect, test } from "vitest";

import {
  checksumAddress,
  getAddress,
  isAddress,
  shortenAddress,
} from "./address.js";

describe("getAddress", () => {
  test("checksums address", () => {
    expect(
      getAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"),
    ).toMatchInlineSnapshot('"0xA0Cf798816D4b9b9866b5330EEa46a18382f251e"');
    expect(
      getAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"),
    ).toMatchInlineSnapshot('"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"');
    expect(
      getAddress("0x70997970c51812dc3a010c7d01b50e0d17dc79c8"),
    ).toMatchInlineSnapshot('"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"');
    expect(
      getAddress("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"),
    ).toMatchInlineSnapshot('"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"');
    expect(
      getAddress("0x90f79bf6eb2c4f870365e785982e1f101e93b906"),
    ).toMatchInlineSnapshot('"0x90F79bf6EB2c4f870365E785982E1f101E93b906"');
    expect(
      getAddress("0x15d34aaf54267db7d7c367839aaf71a00a2c6a65"),
    ).toMatchInlineSnapshot('"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"');
  });

  test("errors on invalid address", () => {
    expect(() => getAddress("0x0")).toThrowErrorMatchingInlineSnapshot(
      "[Error: Invalid address: 0x0]",
    );
    expect(() => getAddress("0x")).toThrowErrorMatchingInlineSnapshot(
      "[Error: Invalid address: 0x]",
    );
    expect(() => getAddress("0x0x0")).toThrowErrorMatchingInlineSnapshot(
      "[Error: Invalid address: 0x0x0]",
    );
    expect(() => getAddress("0x0x")).toThrowErrorMatchingInlineSnapshot(
      "[Error: Invalid address: 0x0x]",
    );
    expect(() => getAddress("0x0x0x")).toThrowErrorMatchingInlineSnapshot(
      "[Error: Invalid address: 0x0x0x]",
    );
  });
});

describe("isAddress", () => {
  test("checks if address is valid", () => {
    expect(isAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac")).toBeFalsy();
    expect(isAddress("x")).toBeFalsy();
    expect(isAddress("0xa")).toBeFalsy();
    expect(
      isAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"),
    ).toBeTruthy();
    expect(isAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678az")).toBeFalsy();
    expect(
      isAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678aff"),
    ).toBeFalsy();
    expect(isAddress("a5cc3c03994db5b0d9a5eEdD10Cabab0813678ac")).toBeFalsy();
  });
});

describe("checksumAddress", () => {
  test("checksums address", () => {
    expect(
      checksumAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"),
    ).toMatchInlineSnapshot('"0xA0Cf798816D4b9b9866b5330EEa46a18382f251e"');
    expect(
      checksumAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"),
    ).toMatchInlineSnapshot('"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"');
    expect(
      checksumAddress("0x70997970c51812dc3a010c7d01b50e0d17dc79c8"),
    ).toMatchInlineSnapshot('"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"');
    expect(
      checksumAddress("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"),
    ).toMatchInlineSnapshot('"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"');
    expect(
      checksumAddress("0x90f79bf6eb2c4f870365e785982e1f101e93b906"),
    ).toMatchInlineSnapshot('"0x90F79bf6EB2c4f870365E785982E1f101E93b906"');
    expect(
      checksumAddress("0x15d34aaf54267db7d7c367839aaf71a00a2c6a65"),
    ).toMatchInlineSnapshot('"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"');
  });
});

describe("shortenAddress", () => {
  test("shortens address", () => {
    expect(
      shortenAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"),
    ).toMatchInlineSnapshot('"0xA0Cf...251e"');
  });
});
