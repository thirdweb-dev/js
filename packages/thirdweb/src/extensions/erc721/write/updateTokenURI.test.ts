import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deployERC721Contract } from "../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFT } from "../read/getNFT.js";
import { mintTo } from "./mintTo.js";
import { updateTokenURI } from "./updateTokenURI.js";

const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;
const account = TEST_ACCOUNT_C;

describe.runIf(process.env.TW_SECRET_KEY)(
  "NFTCollection: Update token uri",
  () => {
    it("should update token uri", async () => {
      const address = await deployERC721Contract({
        client,
        chain,
        account,
        type: "TokenERC721",
        params: {
          name: "NFT collection",
          contractURI: TEST_CONTRACT_URI,
        },
      });
      const contract = getContract({
        address,
        client,
        chain,
      });
      await sendAndConfirmTransaction({
        transaction: mintTo({
          contract,
          nft: { name: "Test1" },
          to: account.address,
        }),
        account,
      });
      await sendAndConfirmTransaction({
        transaction: updateTokenURI({
          contract,
          newMetadata: { name: "Test1 Updated" },
          tokenId: 0n,
        }),
        account,
      });
      const nft = await getNFT({ contract, tokenId: 0n });
      expect(nft.metadata.name).toBe("Test1 Updated");
    });
  },
);
