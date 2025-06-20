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
        chain,
        client,
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
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "Token",
        },
        type: "TokenERC20",
      });

      const erc20Contract = getContract({
        address: erc20Address,
        chain,
        client,
      });

      const erc721Address = await deployERC721Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "NFTCollection",
        },
        type: "TokenERC721",
      });

      const erc721Contract = getContract({
        address: erc721Address,
        chain,
        client,
      });
      // Mint some ERC20 tokens
      await sendAndConfirmTransaction({
        account,
        transaction: mintToERC20({
          amount: "100",
          contract: erc20Contract,
          to: account.address,
        }),
      });

      // Set allowance for Pack contract
      await sendAndConfirmTransaction({
        account,
        transaction: approve({
          amount: "1000000000000000",
          contract: erc20Contract,
          spender: packContract.address,
        }),
      });

      // Mint some ERC721 tokens
      await sendAndConfirmTransaction({
        account,
        transaction: mintToERC721({
          contract: erc721Contract,
          nft: { name: "token #0" },
          to: account.address,
        }),
      });

      // set erc721 approval
      await sendAndConfirmTransaction({
        account,
        transaction: setApprovalForAll({
          approved: true,
          contract: erc721Contract,
          operator: packContract.address,
        }),
      });

      // Create pack
      await sendAndConfirmTransaction({
        account,
        transaction: createNewPack({
          amountDistributedPerOpen: 1n,
          client,
          contract: packContract,
          erc20Rewards: [
            {
              contractAddress: erc20Contract.address,
              quantityPerReward: 1,
              totalRewards: 1,
            },
          ],
          erc721Rewards: [
            { contractAddress: erc721Contract.address, tokenId: 0n },
          ],
          openStartTimestamp: new Date(),
          packMetadata: {
            name: "Pack #0",
          },
          recipient: account.address,
          tokenOwner: account.address,
        }),
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
        getTokenCountOfBundle({ bundleId: 0n, contract: packContract }),
        getUriOfBundle({ bundleId: 0n, contract: packContract }),
        balanceOfERC20({ address: account.address, contract: erc20Contract }),
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
            tokenId: 0n,
            tokenType: 0,
            totalAmount: 1000000000000000000n,
          },
          {
            assetContract: erc721Contract.address,
            tokenId: 0n,
            tokenType: 1,
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
          amountToOpen: 1n,
          contract: packContract,
          packId: 0n,
        }),
      });

      const [erc20Balance, erc721Owner] = await Promise.all([
        balanceOfERC20({ address: account.address, contract: erc20Contract }),
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
