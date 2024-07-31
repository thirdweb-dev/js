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
import {
  airdropERC1155WithSignature,
  generateAirdropSignatureERC1155,
} from "./airdropERC1155WithSignature.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe
  .runIf(process.env.TW_SECRET_KEY)
  .sequential("generateAirdropSignatureERC11551155", () => {
    let airdropContract: ThirdwebContract;
    let erc1155TokenContract: ThirdwebContract;

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

    it("should send airdrop of ERC1155 tokens with signature", async () => {
      const contents = [
        { recipient: TEST_ACCOUNT_B.address, tokenId: 0n, amount: 10n },
        { recipient: TEST_ACCOUNT_C.address, tokenId: 0n, amount: 12n },
        { recipient: TEST_ACCOUNT_D.address, tokenId: 1n, amount: 5n },
      ];
      const { req, signature } = await generateAirdropSignatureERC1155({
        airdropRequest: {
          tokenAddress: erc1155TokenContract.address,
          contents,
        },
        account: TEST_ACCOUNT_A,
        contract: airdropContract,
      });

      const transaction = airdropERC1155WithSignature({
        contract: airdropContract,
        req,
        signature,
      });
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });

      const balanceB = await balanceOf({
        contract: erc1155TokenContract,
        owner: TEST_ACCOUNT_B.address,
        tokenId: 0n,
      });

      const balanceC = await balanceOf({
        contract: erc1155TokenContract,
        owner: TEST_ACCOUNT_C.address,
        tokenId: 0n,
      });

      const balanceD = await balanceOf({
        contract: erc1155TokenContract,
        owner: TEST_ACCOUNT_D.address,
        tokenId: 1n,
      });

      expect(balanceB).to.equal(10n);
      expect(balanceC).to.equal(12n);
      expect(balanceD).to.equal(5n);

      expect(transactionHash.length).toBe(66);
    });
  });
