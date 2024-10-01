import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { delegate } from "../../../extensions/erc20/__generated__/IVotes/write/delegate.js";
import { mintTo } from "../../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { deployVoteContract } from "../../../extensions/prebuilts/deploy-vote.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { propose } from "../__generated__/Vote/write/propose.js";
import { getAll } from "./getAll.js";
import { proposalExists } from "./proposalExists.js";

const account = TEST_ACCOUNT_C;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("proposal exists", () => {
  it("should return false if Vote doesn't have any proposal", async () => {
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
        initialProposalThreshold: "0.5",
        initialVotingPeriod: 10,
        minVoteQuorumRequiredPercent: 51,
      },
    });

    const contract = getContract({
      address,
      chain,
      client,
    });

    const result = await proposalExists({ contract, proposalId: 0n });
    expect(result).toBe(false);
  });

  it("should return true if Vote has the proposal (id)", async () => {
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
        initialProposalThreshold: "0.5",
        initialVotingPeriod: 10,
        minVoteQuorumRequiredPercent: 51,
      },
    });

    const contract = getContract({
      address,
      chain,
      client,
    });

    const tokenContract = getContract({
      address: tokenAddress,
      chain,
      client,
    });
    // first step: mint enough tokens so it passes the voting threshold
    const mintTransaction = mintTo({
      contract: tokenContract,
      to: account.address,
      amount: "1000",
    });
    await sendAndConfirmTransaction({ transaction: mintTransaction, account });
    // 2nd step: to delegate the token
    const delegation = delegate({
      contract: tokenContract,
      delegatee: account.address,
    });
    await sendAndConfirmTransaction({ transaction: delegation, account });

    // step 3: create a proposal
    const transaction = propose({
      contract,
      description: "first proposal",
      targets: [contract.address],
      values: [0n],
      calldatas: ["0x"],
    });
    await sendAndConfirmTransaction({ transaction, account });
    const allProposals = await getAll({ contract });
    expect(allProposals.length).toBe(1);
    const result = await proposalExists({
      contract,
      proposalId: allProposals[0]?.proposalId || -1n,
    });
    expect(result).toBe(true);
  });
});
