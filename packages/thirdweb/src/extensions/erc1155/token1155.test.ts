import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { getContractMetadata } from "../common/read/getContractMetadata.js";
import { deployERC1155Contract } from "../prebuilts/deploy-erc1155.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { totalSupply } from "./__generated__/IERC1155/read/totalSupply.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { getNFT } from "./read/getNFT.js";
import { getNFTs } from "./read/getNFTs.js";
import { mintAdditionalSupplyTo } from "./write/mintAdditionalSupplyTo.js";
import { mintTo } from "./write/mintTo.js";

describe.runIf(process.env.TW_SECRET_KEY)("TokenERC1155", () => {
  let contract: ThirdwebContract;

  beforeAll(async () => {
    const contractAddress = await deployERC1155Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "Test TokenERC1155",
      },
      type: "TokenERC1155",
    });

    contract = getContract({
      address: contractAddress,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    // this deploys a contract, it may take some time
  }, 60_000);

  describe("Deployment", () => {
    it("should deploy", async () => {
      expect(contract).toBeDefined();
    });
    it("should have the correct name", async () => {
      const metadata = await getContractMetadata({ contract });
      expect(metadata.name).toBe("Test TokenERC1155");
    });
  });

  it("should allow for minting tokens", async () => {
    // initially no tokens minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(0n);

    // mint 1 token
    const mintTx = mintTo({
      contract,
      to: TEST_ACCOUNT_A.address,
      supply: 10n,
      nft: { name: "Test NFT" },
    });
    await sendAndConfirmTransaction({
      transaction: mintTx,
      account: TEST_ACCOUNT_A,
    });

    // now 1 token minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(1n);
    // tokenId 0 is minted
    await expect(
      getNFT({ contract, tokenId: 0n }),
    ).resolves.toMatchInlineSnapshot(`
        {
          "id": 0n,
          "metadata": {
            "name": "Test NFT",
          },
          "owner": null,
          "supply": 10n,
          "tokenURI": "ipfs://QmUut8sypH8NaPUeksnirut7MgggMeQa9RvJ37sV513sw3/0",
          "type": "ERC1155",
        }
      `);
    // account should have a balance of 10
    await expect(
      balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 0n }),
    ).resolves.toBe(10n);
    // totalSupply should be 10
    await expect(totalSupply({ contract, id: 0n })).resolves.toBe(10n);

    // mint additional supply
    const mintTx2 = mintAdditionalSupplyTo({
      contract,
      to: TEST_ACCOUNT_A.address,
      supply: 5n,
      tokenId: 0n,
    });

    await sendAndConfirmTransaction({
      transaction: mintTx2,
      account: TEST_ACCOUNT_A,
    });

    // still 1 token minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(1n);
    // tokenId 0 is minted
    // supply should be 15
    await expect(
      getNFT({ contract, tokenId: 0n }),
    ).resolves.toMatchInlineSnapshot(`
        {
          "id": 0n,
          "metadata": {
            "name": "Test NFT",
          },
          "owner": null,
          "supply": 15n,
          "tokenURI": "ipfs://QmUut8sypH8NaPUeksnirut7MgggMeQa9RvJ37sV513sw3/0",
          "type": "ERC1155",
        }
      `);
    // account should have a balance of 15
    await expect(
      balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 0n }),
    ).resolves.toBe(15n);
    // totalSupply should be 15
    await expect(totalSupply({ contract, id: 0n })).resolves.toBe(15n);

    // mint a second token
    const mintTx3 = mintTo({
      contract,
      to: TEST_ACCOUNT_B.address,
      supply: 5n,
      nft: { name: "Test NFT 2" },
    });

    await sendAndConfirmTransaction({
      transaction: mintTx3,
      account: TEST_ACCOUNT_A,
    });

    // now 2 tokens minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(2n);
    await expect(getNFTs({ contract })).resolves.toMatchInlineSnapshot(`
      [
        {
          "id": 0n,
          "metadata": {
            "name": "Test NFT",
          },
          "owner": null,
          "supply": 15n,
          "tokenURI": "ipfs://QmUut8sypH8NaPUeksnirut7MgggMeQa9RvJ37sV513sw3/0",
          "type": "ERC1155",
        },
        {
          "id": 1n,
          "metadata": {
            "name": "Test NFT 2",
          },
          "owner": null,
          "supply": 5n,
          "tokenURI": "ipfs://QmV6gsfzdiMRtpnh8ay3CgutStVbes7qoF4DKpYE64h8hT/0",
          "type": "ERC1155",
        },
      ]
    `);
  });
});
