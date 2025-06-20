import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { deployVoteContract } from "./deploy-vote.js";

const account = TEST_ACCOUNT_B;

describe.runIf(process.env.TW_SECRET_KEY)("deploy-voteERC20 contract", () => {
  it("should throw if passed an non-integer-like value to minVoteQuorumRequiredPercent", async () => {
    await expect(
      deployVoteContract({
        account,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: TEST_CONTRACT_URI,
          initialProposalThreshold: "0.5",
          initialVotingPeriod: 10,
          minVoteQuorumRequiredPercent: 51.12,
          name: "",
          tokenAddress: "doesnt matter here, code wont be reached",
        },
      }),
    ).rejects.toThrowError(
      "51.12 is an invalid value. Only integer-like values accepted",
    );
  });
});
