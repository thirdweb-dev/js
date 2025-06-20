import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT, USDT_CONTRACT } from "~test/test-contracts.js";
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
});
