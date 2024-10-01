import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { isAddress } from "../../utils/address.js";
import { deployERC20Contract } from "./deploy-erc20.js";
import { deployVoteContract } from "./deploy-vote.js";

const account = TEST_ACCOUNT_B;

describe.runIf(process.env.TW_SECRET_KEY)("deploy-voteERC20 contract", () => {
  it("should deploy Vote contract", async () => {
    const tokenAddress = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "TokenERC20",
      params: {
        name: "Token",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const address = await deployVoteContract({
      account,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
        tokenAddress: tokenAddress,
        // user needs 0.5 <token> to create proposal
        initialProposalThreshold: "0.5",
        // vote expires 10 blocks later
        initialVotingPeriod: 10,
        // Requires 51% of users who voted, voted "For", for this proposal to pass
        minVoteQuorumRequiredPercent: 51,
      },
    });
    expect(address).toBeDefined();
    expect(isAddress(address)).toBe(true);
    // Further tests to verify the functionality of this contract
    // are done in other Vote tests
  });

  it("should throw if passed an non-integer-like value to minVoteQuorumRequiredPercent", async () => {
    const tokenAddress = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "TokenERC20",
      params: {
        name: "Token",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    await expect(() =>
      deployVoteContract({
        account,
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        params: {
          name: "",
          contractURI: TEST_CONTRACT_URI,
          tokenAddress: tokenAddress,
          initialProposalThreshold: "0.5",
          initialVotingPeriod: 10,
          minVoteQuorumRequiredPercent: 51.12,
        },
      }),
    ).rejects.toThrowError(
      "51.12 is an invalid value. Only integer-like values accepted",
    );
  });
});
