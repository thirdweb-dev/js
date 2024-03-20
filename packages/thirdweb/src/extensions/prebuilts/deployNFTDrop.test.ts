import { describe, expect, it } from "vitest";
import { deployNFTDrop } from "./deployNFTDrop.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import {
  bootstrapImplementation,
  bootstrapOnchainInfra,
} from "../../contract/deployment/utils/bootstrap.js";

describe("deployNFTDrop", () => {
  it("should deploy NFT drop", async () => {
    await bootstrapOnchainInfra({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
    });
    await bootstrapImplementation({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      contractId: "DropERC721",
    });
    const address = await deployNFTDrop({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      params: {
        name: "NFTDrop unified",
        symbol: "NFTD",
      },
    });
    expect(address).toBe("0xEd7AabAB416b5648E70adeEF8E23993E78C1A262");
  });
});
