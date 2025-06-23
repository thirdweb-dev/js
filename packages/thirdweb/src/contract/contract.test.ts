import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { USDT_CONTRACT_ADDRESS } from "~test/test-contracts.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { getContract } from "./contract.js";

describe("Contract - getContract", () => {
  it("should throw error if client is not passed", () => {
    expect(() =>
      // @ts-ignore Test purpose
      getContract({ address: "0x", chain: ethereum }),
    ).toThrowError(
      `getContract validation error - invalid client: ${undefined}`,
    );
  });

  it("should throw error if address is not valid", () => {
    expect(() =>
      getContract({ address: "0x", chain: ethereum, client: TEST_CLIENT }),
    ).toThrowError("getContract validation error - invalid address: 0x");
  });

  it("should throw error if chain is not passed", () => {
    expect(() =>
      // @ts-ignore Test purpose
      getContract({ address: USDT_CONTRACT_ADDRESS, client: TEST_CLIENT }),
    ).toThrowError(
      `getContract validation error - invalid chain: ${undefined}`,
    );
  });

  it("should throw error if chain doesn't have id", () => {
    expect(() =>
      getContract({
        address: USDT_CONTRACT_ADDRESS,
        // @ts-ignore Test
        chain: {},
        client: TEST_CLIENT,
      }),
    ).toThrowError(`getContract validation error - invalid chain: ${{}}`);
  });
});
