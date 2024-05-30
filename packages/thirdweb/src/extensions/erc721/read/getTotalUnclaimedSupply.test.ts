import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { claimTo } from "../drops/write/claimTo.js";
import { setClaimConditions } from "../drops/write/setClaimConditions.js";
import { lazyMint } from "../write/lazyMint.js";
import { getTotalUnclaimedSupply } from "./getTotalUnclaimedSupply.js";

const account = TEST_ACCOUNT_A;
let contract: ThirdwebContract;

describe.runIf(process.env.TW_SECRET_KEY)(
  "erc721: getTotalClaimedSupply",
  () => {
    beforeEach(async () => {
      const address = await deployERC721Contract({
        client: TEST_CLIENT,
        account,
        type: "DropERC721",
        chain: ANVIL_CHAIN,
        params: {
          name: "",
          contractURI: TEST_CONTRACT_URI,
        },
      });

      contract = getContract({
        chain: ANVIL_CHAIN,
        address,
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

      await sendAndConfirmTransaction({ transaction: lazyMintTx, account });

      const setClaimTx = setClaimConditions({
        contract,
        phases: [
          {
            maxClaimableSupply: 100n,
            maxClaimablePerWallet: 100n,
            currencyAddress: NATIVE_TOKEN_ADDRESS,
            price: 0,
            startTime: new Date(),
          },
        ],
      });

      await sendAndConfirmTransaction({
        transaction: setClaimTx,
        account,
      });
    });

    it("should return the correct un-claimed amount", async () => {
      const tx = claimTo({
        contract,
        to: account.address,
        quantity: 1n,
      });
      await sendAndConfirmTransaction({ transaction: tx, account });
      const result = await getTotalUnclaimedSupply({ contract });
      expect(result).toBe(2n);
    });
  },
);
