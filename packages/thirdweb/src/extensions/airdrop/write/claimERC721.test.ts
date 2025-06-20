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
import {
  ownerOf,
  setApprovalForAll,
} from "../../../exports/extensions/erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { mintTo } from "../../erc721/write/mintTo.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import { setMerkleRoot } from "../__generated__/Airdrop/write/setMerkleRoot.js";
import { claimERC721 } from "./claimERC721.js";
import { generateMerkleTreeInfoERC721 } from "./merkleInfoERC721.js";
import { saveSnapshot } from "./saveSnapshot.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY).skip("claimERC721", () => {
  let airdropContract: ThirdwebContract;
  let erc721TokenContract: ThirdwebContract;

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

    erc721TokenContract = getContract({
      address: await deployERC721Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC721",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const mintTransactions = [
      mintTo({
        contract: erc721TokenContract,
        nft: {
          name: "Test 0",
        },
        to: TEST_ACCOUNT_A.address,
      }),
      mintTo({
        contract: erc721TokenContract,
        nft: {
          name: "Test 1",
        },
        to: TEST_ACCOUNT_A.address,
      }),
      mintTo({
        contract: erc721TokenContract,
        nft: {
          name: "Test 2",
        },
        to: TEST_ACCOUNT_A.address,
      }),
      mintTo({
        contract: erc721TokenContract,
        nft: {
          name: "Test 3",
        },
        to: TEST_ACCOUNT_A.address,
      }),
    ];

    for (const tx of mintTransactions) {
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: tx,
      });
    }

    const approvalTx = setApprovalForAll({
      approved: true,
      contract: erc721TokenContract,
      operator: airdropContract.address,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: approvalTx,
    });
  }, 60000);

  it("should send ERC721 tokens to allowlisted claimer", async () => {
    const snapshot = [
      { recipient: TEST_ACCOUNT_B.address, tokenId: 0 },
      { recipient: TEST_ACCOUNT_C.address, tokenId: 1 },
      { recipient: TEST_ACCOUNT_D.address, tokenId: 2 },
    ];

    const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC721({
      contract: airdropContract,
      snapshot,
      tokenAddress: erc721TokenContract.address,
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
      token: erc721TokenContract.address,
      tokenMerkleRoot: merkleRoot as `0x${string}`,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: setMerkleRootTransaction,
    });

    const claimTransaction = claimERC721({
      contract: airdropContract,
      recipient: TEST_ACCOUNT_B.address,
      tokenAddress: erc721TokenContract.address,
    });
    const { transactionHash } = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: claimTransaction,
    });

    const ownerZero = await ownerOf({
      contract: erc721TokenContract,
      tokenId: 0n,
    });

    expect(ownerZero).to.equal(TEST_ACCOUNT_B.address);

    expect(transactionHash.length).toBe(66);
  });
});
