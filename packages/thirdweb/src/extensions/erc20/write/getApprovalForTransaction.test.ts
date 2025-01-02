import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { lazyMint } from "../../../extensions/erc721/write/lazyMint.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { claimTo } from "../../erc721/drops/write/claimTo.js";
import { setClaimConditions } from "../../erc721/drops/write/setClaimConditions.js";
import { getApprovalForTransaction } from "./getApprovalForTransaction.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_A;

describe.runIf(process.env.TW_SECRET_KEY)(
  "erc20: getApporvalForTransaction",
  () => {
    it("should return an approval tx", async () => {
      const currencyAddress = await deployERC20Contract({
        chain,
        client,
        account,
        type: "TokenERC20",
        params: { name: "erc20token", contractURI: TEST_CONTRACT_URI },
      });
      const contract = getContract({
        address: await deployERC721Contract({
          client,
          chain,
          account,
          type: "DropERC721",
          params: { name: "", contractURI: TEST_CONTRACT_URI },
        }),
        chain,
        client,
      });
      await sendAndConfirmTransaction({
        transaction: lazyMint({ contract, nfts: [{ name: "token 0" }] }),
        account,
      });
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimableSupply: 100n,
              maxClaimablePerWallet: 1n,
              currencyAddress,
              price: 1,
              startTime: new Date(),
            },
          ],
        }),
        account,
      });
      const approveTx = await getApprovalForTransaction({
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_B.address,
          quantity: 1n,
        }),
        account,
      });
      expect(approveTx?.to).toBe(currencyAddress);
    });

    it("should return NULL", async () => {
      const contract = getContract({
        address: await deployERC721Contract({
          client,
          chain,
          account,
          type: "DropERC721",
          params: { name: "", contractURI: TEST_CONTRACT_URI },
        }),
        chain,
        client,
      });
      await sendAndConfirmTransaction({
        transaction: lazyMint({ contract, nfts: [{ name: "token 0" }] }),
        account,
      });
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimableSupply: 100n,
              maxClaimablePerWallet: 1n,
              price: 1,
              startTime: new Date(),
            },
          ],
        }),
        account,
      });
      const approveTx = await getApprovalForTransaction({
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_B.address,
          quantity: 1n,
        }),
        account,
      });
      expect(approveTx).toBe(null);
    });
  },
);
