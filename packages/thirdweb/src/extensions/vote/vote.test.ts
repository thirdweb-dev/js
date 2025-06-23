import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { delegate } from "../erc20/__generated__/IVotes/write/delegate.js";
import { mintTo } from "../erc20/write/mintTo.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { deployVoteContract } from "../prebuilts/deploy-vote.js";
import { propose } from "./__generated__/Vote/write/propose.js";
import { getAll } from "./read/getAll.js";
import { proposalExists } from "./read/proposalExists.js";

const account = TEST_ACCOUNT_C;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("proposal exists", () => {
  it("`proposalExists` and `propose` should work", async () => {
    const tokenAddress = await deployERC20Contract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "Token",
      },
      type: "TokenERC20",
    });
    const address = await deployVoteContract({
      account,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        contractURI: TEST_CONTRACT_URI,
        initialProposalThreshold: "0.5",
        initialVotingPeriod: 10,
        minVoteQuorumRequiredPercent: 51,
        name: "",
        tokenAddress: tokenAddress,
      },
    });
    const voteContract = getContract({
      address,
      chain,
      client,
    });
    const result = await proposalExists({
      contract: voteContract,
      proposalId: 0n,
    });
    expect(result).toBe(false);

    const tokenContract = getContract({
      address: tokenAddress,
      chain,
      client,
    });
    // first step: mint enough tokens so it passes the voting threshold
    const mintTransaction = mintTo({
      amount: "1000",
      contract: tokenContract,
      to: account.address,
    });
    await sendAndConfirmTransaction({ account, transaction: mintTransaction });
    // 2nd step: to delegate the token
    const delegation = delegate({
      contract: tokenContract,
      delegatee: account.address,
    });
    await sendAndConfirmTransaction({ account, transaction: delegation });

    // step 3: create a proposal
    const transaction = propose({
      calldatas: ["0x"],
      contract: voteContract,
      description: "first proposal",
      targets: [voteContract.address],
      values: [0n],
    });
    await sendAndConfirmTransaction({ account, transaction });
    const allProposals = await getAll({ contract: voteContract });
    expect(allProposals.length).toBe(1);
    const exists = await proposalExists({
      contract: voteContract,
      proposalId: allProposals[0]?.proposalId || -1n,
    });
    expect(exists).toBe(true);
  });
});
