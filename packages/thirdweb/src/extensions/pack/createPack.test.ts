import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { download } from "../../storage/download.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { approve } from "../erc20/write/approve.js";
import { mintTo as mintToERC20 } from "../erc20/write/mintTo.js";
import { setApprovalForAll } from "../erc721/__generated__/IERC721A/write/setApprovalForAll.js";
import { mintTo as mintToERC721 } from "../erc721/write/mintTo.js";
import { getPackContents } from "../erc1155/__generated__/IPack/read/getPackContents.js";
import { getTokenCountOfBundle } from "../erc1155/__generated__/IPack/read/getTokenCountOfBundle.js";
import { getUriOfBundle } from "../erc1155/__generated__/IPack/read/getUriOfBundle.js";
import { openPack } from "../erc1155/__generated__/IPack/write/openPack.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../prebuilts/deploy-erc721.js";
import { deployPackContract } from "../prebuilts/deploy-pack.js";
import { createPack } from "./createPack.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("createPack", () => {
  it("should work", async () => {
    const packAddress = await deployPackContract({
      account,
      client,
      chain,
      params: {
        name: "pack-contract",
      },
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

    const erc20Contract = getContract({ address: erc20Address, chain, client });

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
        spender: packAddress,
      }),
      account,
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
        operator: packAddress,
      }),
      account,
    });

    const packContract = getContract({
      address: packAddress,
      chain,
      client,
    });

    // Create pack
    await sendAndConfirmTransaction({
      transaction: createPack({
        contract: packContract,
        erc20Rewards: [
          {
            contractAddress: erc20Address,
            totalRewards: 1,
            quantityPerReward: 1,
          },
        ],
        erc721Rewards: [{ contractAddress: erc721Address, tokenId: 0n }],
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
    const [packContent, tokenCountOfBundle, bundleUri] = await Promise.all([
      getPackContents({ contract: packContract, packId: 0n }),
      getTokenCountOfBundle({ contract: packContract, bundleId: 0n }),
      getUriOfBundle({ contract: packContract, bundleId: 0n }),
    ]);

    // Make sure the content is correct
    expect(packContent).toStrictEqual([
      [
        {
          assetContract: erc20Address,
          tokenType: 0,
          tokenId: 0n,
          totalAmount: 1000000000000000000n,
        },
        {
          assetContract: erc721Address,
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
    const metadata = await (await download({ client, uri: bundleUri })).json();
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

    // Make sure the remaining content reflects the correct amount
    const remainingPackContent = await getPackContents({
      contract: packContract,
      packId: 0n,
    });

    console.log(remainingPackContent);
  });
});
