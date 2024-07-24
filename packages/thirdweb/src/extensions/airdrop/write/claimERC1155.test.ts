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
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import {
  balanceOf,
  setApprovalForAll,
} from "../../../exports/extensions/erc1155.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { mintTo } from "../../erc1155/write/mintTo.js";
import { deployERC1155Contract } from "../../prebuilts/deploy-erc1155.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import { setMerkleRoot } from "../__generated__/Airdrop/write/setMerkleRoot.js";
import { claimERC1155 } from "./claimERC1155.js";
import { generateMerkleTreeInfoERC1155 } from "./merkleInfoERC1155.js";
import { saveSnapshot } from "./saveSnapshot.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("claimERC1155", () => {
  let airdropContract: ThirdwebContract;
  let erc1155TokenContract: ThirdwebContract;

  beforeAll(async () => {
    airdropContract = getContract({
      address: await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "Airdrop",
        publisher: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
        contractParams: [TEST_ACCOUNT_A.address, ""],
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    erc1155TokenContract = getContract({
      address: await deployERC1155Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC1155",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const mintTransactions = [
      mintTo({
        contract: erc1155TokenContract,
        to: TEST_ACCOUNT_A.address,
        supply: 100000n,
        nft: {
          name: "Test 0",
        },
      }),
      mintTo({
        contract: erc1155TokenContract,
        to: TEST_ACCOUNT_A.address,
        supply: 100000n,
        nft: {
          name: "Test 1",
        },
      }),
    ];

    for (const tx of mintTransactions) {
      await sendAndConfirmTransaction({
        transaction: tx,
        account: TEST_ACCOUNT_A,
      });
    }

    const approvalTx = setApprovalForAll({
      contract: erc1155TokenContract,
      operator: airdropContract.address,
      approved: true,
    });
    await sendAndConfirmTransaction({
      transaction: approvalTx,
      account: TEST_ACCOUNT_A,
    });
  }, 60000);

  it("should send ERC1155 tokens to allowlisted claimer", async () => {
    const snapshot = [
      { recipient: TEST_ACCOUNT_B.address, tokenId: 0, amount: 10 },
      { recipient: TEST_ACCOUNT_C.address, tokenId: 0, amount: 12 },
      { recipient: TEST_ACCOUNT_D.address, tokenId: 1, amount: 5 },
    ];

    const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC1155({
      snapshot,
      tokenAddress: erc1155TokenContract.address,
      contract: airdropContract,
    });
    const saveSnapshotTransaction = saveSnapshot({
      merkleRoot,
      snapshotUri,
      contract: airdropContract,
    });
    await sendAndConfirmTransaction({
      transaction: saveSnapshotTransaction,
      account: TEST_ACCOUNT_A,
    });

    const setMerkleRootTransaction = setMerkleRoot({
      token: erc1155TokenContract.address,
      tokenMerkleRoot: merkleRoot as `0x${string}`,
      resetClaimStatus: true,
      contract: airdropContract,
    });
    await sendAndConfirmTransaction({
      transaction: setMerkleRootTransaction,
      account: TEST_ACCOUNT_A,
    });

    const claimTransaction = claimERC1155({
      tokenAddress: erc1155TokenContract.address,
      recipient: TEST_ACCOUNT_B.address,
      contract: airdropContract,
    });
    const { transactionHash } = await sendAndConfirmTransaction({
      transaction: claimTransaction,
      account: TEST_ACCOUNT_A,
    });

    const balanceB = await balanceOf({
      contract: erc1155TokenContract,
      owner: TEST_ACCOUNT_B.address,
      tokenId: 0n,
    });

    expect(balanceB).to.equal(10n);

    expect(transactionHash.length).toBe(66);
  });
});
