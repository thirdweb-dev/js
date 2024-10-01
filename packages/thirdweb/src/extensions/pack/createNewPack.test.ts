import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { download } from "../../storage/download.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf as balanceOfERC20 } from "../erc20/__generated__/IERC20/read/balanceOf.js";
import { approve } from "../erc20/write/approve.js";
import { mintTo as mintToERC20 } from "../erc20/write/mintTo.js";
import { balanceOf as balanceOfERC721 } from "../erc721/__generated__/IERC721A/read/balanceOf.js";
import { ownerOf } from "../erc721/__generated__/IERC721A/read/ownerOf.js";
import { setApprovalForAll } from "../erc721/__generated__/IERC721A/write/setApprovalForAll.js";
import { mintTo as mintToERC721 } from "../erc721/write/mintTo.js";
import { openPack } from "../erc1155/__generated__/IPack/write/openPack.js";
import { getPackContents } from "../pack/__generated__/IPack/read/getPackContents.js";
import { getTokenCountOfBundle } from "../pack/__generated__/IPack/read/getTokenCountOfBundle.js";
import { getUriOfBundle } from "../pack/__generated__/IPack/read/getUriOfBundle.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../prebuilts/deploy-erc721.js";
import { deployPackContract } from "../prebuilts/deploy-pack.js";
import { createNewPack } from "./createNewPack.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

// TODO Make this test works!
describe.skip("createNewPack", () => {
  describe.runIf(process.env.TW_SECRET_KEY)("createPack", () => {
    it("should create a Pack and open it to receive rewards", async () => {
      const packAddress = await deployPackContract({
        account,
        client,
        chain,
        params: {
          name: "pack-contract",
        },
      });

      const packContract = getContract({
        address: packAddress,
        chain,
        client,
      });

      const erc20Address = await deployERC20Contract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        type: "TokenERC20",
        params: {
          name: "Token",
          contractURI: TEST_CONTRACT_URI,
        },
      });

      const erc20Contract = getContract({
        address: erc20Address,
        chain,
        client,
      });

      const erc721Address = await deployERC721Contract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        type: "TokenERC721",
        params: {
          name: "NFTCollection",
          contractURI: TEST_CONTRACT_URI,
        },
      });

      const erc721Contract = getContract({
        address: erc721Address,
        chain,
        client,
      });
      // Mint some ERC20 tokens
      await sendAndConfirmTransaction({
        transaction: mintToERC20({
          contract: erc20Contract,
          to: account.address,
          amount: "100",
        }),
        account,
      });

      // Set allowance for Pack contract
      await sendAndConfirmTransaction({
        transaction: approve({
          contract: erc20Contract,
          amount: "1000000000000000",
          spender: packContract.address,
        }),
        account,
      });

      // Mint some ERC721 tokens
      await sendAndConfirmTransaction({
        transaction: mintToERC721({
          contract: erc721Contract,
          to: account.address,
          nft: { name: "token #0" },
        }),
        account,
      });

      // set erc721 approval
      await sendAndConfirmTransaction({
        transaction: setApprovalForAll({
          contract: erc721Contract,
          approved: true,
          operator: packContract.address,
        }),
        account,
      });

      // Create pack
      await sendAndConfirmTransaction({
        transaction: createNewPack({
          contract: packContract,
          erc20Rewards: [
            {
              contractAddress: erc20Contract.address,
              totalRewards: 1,
              quantityPerReward: 1,
            },
          ],
          erc721Rewards: [
            { contractAddress: erc721Contract.address, tokenId: 0n },
          ],
          client,
          packMetadata: {
            name: "Pack #0",
          },
          recipient: account.address,
          tokenOwner: account.address,
          openStartTimestamp: new Date(),
          amountDistributedPerOpen: 1n,
        }),
        account,
      });

      // Read the info of the new Pack
      const [
        packContent,
        tokenCountOfBundle,
        bundleUri,
        erc20BalanceAfterCreatePack,
        erc721BalanceAfterCreatePack,
      ] = await Promise.all([
        getPackContents({ contract: packContract, packId: 0n }),
        getTokenCountOfBundle({ contract: packContract, bundleId: 0n }),
        getUriOfBundle({ contract: packContract, bundleId: 0n }),
        balanceOfERC20({ contract: erc20Contract, address: account.address }),
        balanceOfERC721({ contract: erc721Contract, owner: account.address }),
      ]);

      // After this, the account should have 99 ERC20 tokens, and 0 (zero) ERC721 token
      expect(erc20BalanceAfterCreatePack).toBe(99n * 10n ** 18n);
      expect(erc721BalanceAfterCreatePack).toBe(0n);

      // Make sure the content is correct
      expect(packContent).toStrictEqual([
        [
          {
            assetContract: erc20Contract.address,
            tokenType: 0,
            tokenId: 0n,
            totalAmount: 1000000000000000000n,
          },
          {
            assetContract: erc721Contract.address,
            tokenType: 1,
            tokenId: 0n,
            totalAmount: 1n,
          },
        ],
        [1000000000000000000n, 1n],
      ]);
      expect(tokenCountOfBundle).toBe(2n);

      // Make sure the Pack metadata is correct
      expect(bundleUri).toBeDefined();
      const metadata = await (
        await download({ client, uri: bundleUri })
      ).json();
      expect(metadata?.name).toBe("Pack #0");

      // Make sure you can open the Pack, since the open-date was set to "now"
      await sendAndConfirmTransaction({
        account,
        transaction: openPack({
          contract: packContract,
          packId: 0n,
          amountToOpen: 1n,
        }),
      });

      const [erc20Balance, erc721Owner] = await Promise.all([
        balanceOfERC20({ contract: erc20Contract, address: account.address }),
        ownerOf({ contract: erc721Contract, tokenId: 0n }),
      ]);

      // Since opening a Pack gives "random" rewards, in this case we can check if
      // the recipient received either 1. <one ERC20 token>, or 2. <one ERC721 token>
      expect(
        erc20Balance === 100n * 10n ** 18n ||
          erc721Owner.toLowerCase() === account.address.toLowerCase(),
      ).toBe(true);
    });
  });
});
