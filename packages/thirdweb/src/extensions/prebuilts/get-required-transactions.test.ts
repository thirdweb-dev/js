import { describe, expect, it } from "vitest";
import { CLEAN_ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { getRequiredTransactionCount } from "./get-required-transactions.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "getRequiredTransactions",
  {
    timeout: 120000,
  },
  () => {
    it("should count transactions for a published direct deploy contract", async () => {
      const metadata = await fetchPublishedContractMetadata({
        client: TEST_CLIENT,
        contractId: "AccountFactory",
      });
      const results = await getRequiredTransactionCount({
        client: TEST_CLIENT,
        chain: CLEAN_ANVIL_CHAIN,
        metadata,
      });
      expect(results.length).toBe(1);
    });

    it("should count transactions for a published autofactory contract", async () => {
      const metadata = await fetchPublishedContractMetadata({
        client: TEST_CLIENT,
        contractId: "Airdrop",
      });
      const results = await getRequiredTransactionCount({
        client: TEST_CLIENT,
        chain: CLEAN_ANVIL_CHAIN,
        metadata,
      });
      expect(results.length).toBe(4);
    });

    it("should count transactions for a modular contract with modules", async () => {
      const metadata = await fetchPublishedContractMetadata({
        client: TEST_CLIENT,
        contractId: "ERC721CoreInitializable",
      });
      const results = await getRequiredTransactionCount({
        client: TEST_CLIENT,
        chain: CLEAN_ANVIL_CHAIN,
        metadata,
        modules: await Promise.all(
          ["ClaimableERC721", "BatchMetadataERC721", "RoyaltyERC721"].map(
            (contractId) =>
              fetchPublishedContractMetadata({
                client: TEST_CLIENT,
                contractId,
              }),
          ),
        ),
      });
      expect(results.length).toBe(7);
    });
  },
);
