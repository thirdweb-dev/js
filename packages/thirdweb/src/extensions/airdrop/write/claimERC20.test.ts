import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getBalance } from "../../erc20/read/getBalance.js";
import { approve } from "../../erc20/write/approve.js";
import { mintTo } from "../../erc20/write/mintTo.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import { setMerkleRoot } from "../__generated__/Airdrop/write/setMerkleRoot.js";
import { claimERC20 } from "./claimERC20.js";
import { generateMerkleTreeInfoERC20 } from "./merkleInfoERC20.js";
import { saveSnapshot } from "./saveSnapshot.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY).skip("claimERC20", () => {
  let airdropContract: ThirdwebContract;
  let erc20TokenContract: ThirdwebContract;

  beforeAll(async () => {
    airdropContract = getContract({
      address: await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "Airdrop",
        contractParams: {
          contractURI: "",
          defaultAdmin: TEST_ACCOUNT_A.address,
        },
        publisher: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    erc20TokenContract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "TestToken",
          symbol: "TSTT",
        },
        type: "TokenERC20",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const mintTx = mintTo({
      amount: 1000,
      contract: erc20TokenContract,
      to: TEST_ACCOUNT_A.address,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTx,
    });

    const approvalTx = approve({
      amount: 1000,
      contract: erc20TokenContract,
      spender: airdropContract.address,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: approvalTx,
    });
  }, 60000);

  it("should send ERC20 tokens to allowlisted claimer", async () => {
    const snapshot = [
      { amount: 10, recipient: TEST_ACCOUNT_B.address },
      { amount: 15, recipient: TEST_ACCOUNT_C.address },
      { amount: 20, recipient: TEST_ACCOUNT_D.address },
    ];
    const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC20({
      contract: airdropContract,
      snapshot,
      tokenAddress: erc20TokenContract.address,
    });

    const saveSnapshotTransaction = saveSnapshot({
      contract: airdropContract,
      merkleRoot,
      snapshotUri,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: saveSnapshotTransaction,
    });

    const setMerkleRootTransaction = setMerkleRoot({
      contract: airdropContract,
      resetClaimStatus: true,
      token: erc20TokenContract.address,
      tokenMerkleRoot: merkleRoot as `0x${string}`,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: setMerkleRootTransaction,
    });

    const claimTransaction = claimERC20({
      contract: airdropContract,
      recipient: TEST_ACCOUNT_B.address,
      tokenAddress: erc20TokenContract.address,
    });
    const { transactionHash } = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: claimTransaction,
    });

    const balanceB = (
      await getBalance({
        address: TEST_ACCOUNT_B.address,
        contract: erc20TokenContract,
      })
    ).value;

    expect(balanceB).to.equal(10n * 10n ** 18n);

    expect(transactionHash.length).toBe(66);
  });
});
