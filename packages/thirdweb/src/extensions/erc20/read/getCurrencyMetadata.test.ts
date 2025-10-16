import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT, USDT_CONTRACT } from "~test/test-contracts.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { defineChain } from "../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import { getContract } from "../../../contract/contract.js";
import { getCurrencyMetadata } from "./getCurrencyMetadata.js";

describe("getCurrencyMetadata", () => {
  it("should throw if not a valid ERC20 contract", async () => {
    await expect(
      getCurrencyMetadata({ contract: DOODLES_CONTRACT }),
    ).rejects.toThrowError("Invalid currency token");
  });

  it("should return valid result if the contract is ERC20", async () => {
    const result = await getCurrencyMetadata({ contract: USDT_CONTRACT });
    expect(result).toStrictEqual({
      decimals: 6,
      name: "Tether USD",
      symbol: "USDT",
    });
  });

  it("should return valid result if the contract is the native token", async () => {
    const contract = getContract({
      client: TEST_CLIENT,
      address: NATIVE_TOKEN_ADDRESS,
      // define SEI inline, this should pull from the API
      chain: defineChain(1329),
    });
    const result = await getCurrencyMetadata({ contract });
    expect(result).toStrictEqual({
      decimals: 18,
      name: "Sei",
      symbol: "SEI",
    });
  });

  it("should accept PARTIAL chain definitions", async () => {
    const contract = getContract({
      client: TEST_CLIENT,
      address: NATIVE_TOKEN_ADDRESS,
      // define SEI inline, this should pull from the API
      chain: defineChain({
        id: 1329,
        nativeCurrency: {
          name: "Sei _PARTIAL_TEST",
        },
      }),
    });
    const result = await getCurrencyMetadata({ contract });
    expect(result).toStrictEqual({
      decimals: 18,
      name: "Sei _PARTIAL_TEST",
      symbol: "SEI",
    });
  });
});
