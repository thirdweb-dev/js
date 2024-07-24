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
  ownerOf,
  setApprovalForAll,
} from "../../../exports/extensions/erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { mintTo } from "../../erc721/write/mintTo.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import {
  airdropERC721WithSignature,
  generateAirdropSignatureERC721,
} from "./airdropERC721WithSignature.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)(
  "generateAirdropSignatureERC721",
  () => {
    let airdropContract: ThirdwebContract;
    let erc721TokenContract: ThirdwebContract;

    beforeAll(async () => {
      airdropContract = getContract({
        address: await deployPublishedContract({
          account: TEST_ACCOUNT_A,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "Airdrop",
          contractParams: [TEST_ACCOUNT_A.address, ""],
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
          to: TEST_ACCOUNT_A.address,
          nft: {
            name: "Test 0",
          },
        }),
        mintTo({
          contract: erc721TokenContract,
          to: TEST_ACCOUNT_A.address,
          nft: {
            name: "Test 1",
          },
        }),
        mintTo({
          contract: erc721TokenContract,
          to: TEST_ACCOUNT_A.address,
          nft: {
            name: "Test 2",
          },
        }),
        mintTo({
          contract: erc721TokenContract,
          to: TEST_ACCOUNT_A.address,
          nft: {
            name: "Test 3",
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
        contract: erc721TokenContract,
        operator: airdropContract.address,
        approved: true,
      });
      await sendAndConfirmTransaction({
        transaction: approvalTx,
        account: TEST_ACCOUNT_A,
      });
    }, 60000);

    it("should send airdrop of ERC721 tokens with signature", async () => {
      const contents = [
        { recipient: TEST_ACCOUNT_B.address, tokenId: 0n },
        { recipient: TEST_ACCOUNT_C.address, tokenId: 1n },
        { recipient: TEST_ACCOUNT_D.address, tokenId: 2n },
      ];
      const { req, signature } = await generateAirdropSignatureERC721({
        airdropRequest: {
          tokenAddress: erc721TokenContract.address,
          contents,
        },
        account: TEST_ACCOUNT_A,
        contract: airdropContract,
      });

      const transaction = airdropERC721WithSignature({
        contract: airdropContract,
        req,
        signature,
      });
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });

      const ownerZero = await ownerOf({
        contract: erc721TokenContract,
        tokenId: 0n,
      });

      const ownerOne = await ownerOf({
        contract: erc721TokenContract,
        tokenId: 1n,
      });

      const ownerTwo = await ownerOf({
        contract: erc721TokenContract,
        tokenId: 2n,
      });

      expect(ownerZero).to.equal(TEST_ACCOUNT_B.address);
      expect(ownerOne).to.equal(TEST_ACCOUNT_C.address);
      expect(ownerTwo).to.equal(TEST_ACCOUNT_D.address);

      expect(transactionHash.length).toBe(66);
    });
  },
);
