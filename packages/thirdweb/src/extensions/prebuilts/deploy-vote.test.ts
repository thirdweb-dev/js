import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { USDT_CONTRACT_ADDRESS } from "~test/test-contracts.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { isAddress } from "../../utils/address.js";
import { deployVoteContract } from "./deploy-vote.js";

describe("deploy-voteERC20 contract", () => {
  it("should deploy Vote contract", async () => {
    const address = await deployVoteContract({
      account: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
        token: USDT_CONTRACT_ADDRESS,
        initialVotingDelay: 0n,
        initialVotingPeriod: 10n,
        initialProposalThreshold: 50n,
        initialVoteQuorumFraction: 25n,
      },
    });
    expect(address).toBeDefined();
    expect(isAddress(address)).toBe(true);
    // Further tests to verify the functionality of this contract
    // are done in other Vote tests
  });
});
