import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { claimTo } from "../drops/write/claimTo.js";
import { setClaimConditions } from "../drops/write/setClaimConditions.js";
import { lazyMint } from "../write/lazyMint.js";
import { getTotalClaimedSupply } from "./getTotalClaimedSupply.js";

const account = TEST_ACCOUNT_B;
let contract: ThirdwebContract;

describe.runIf(process.env.TW_SECRET_KEY)(
  "erc721: getTotalClaimedSupply",
  () => {
    beforeEach(async () => {
      const address = await deployERC721Contract({
        account,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "",
        },
        type: "DropERC721",
      });

      contract = getContract({
        address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      const lazyMintTx = lazyMint({
        contract,
        // These are the pre-uploaded URIs file - to speed up the test
        nfts: [
          "ipfs://QmVQpAEkbzbqm7fxMJ5up68CppbP5fF7bLxnrtPRMuTaYT/0",
          "ipfs://QmVQpAEkbzbqm7fxMJ5up68CppbP5fF7bLxnrtPRMuTaYT/1",
          "ipfs://QmVQpAEkbzbqm7fxMJ5up68CppbP5fF7bLxnrtPRMuTaYT/2",
        ],
      });

      await sendAndConfirmTransaction({ account, transaction: lazyMintTx });

      const setClaimTx = setClaimConditions({
        contract,
        phases: [
          {
            currencyAddress: NATIVE_TOKEN_ADDRESS,
            maxClaimablePerWallet: 100n,
            maxClaimableSupply: 100n,
            price: 0,
            startTime: new Date(),
          },
        ],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: setClaimTx,
      });
    });

    it("should return the correct claimed amount", async () => {
      const tx = claimTo({
        contract,
        quantity: 1n,
        to: account.address,
      });
      await sendAndConfirmTransaction({ account, transaction: tx });
      const result = await getTotalClaimedSupply({ contract });
      expect(result).toBe(1n);
    });
  },
);
