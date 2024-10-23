import { type Abi, toFunctionSelector } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../test/src/test-wallets.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC1155Contract } from "../prebuilts/deploy-erc1155.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { totalSupply } from "./__generated__/IERC1155/read/totalSupply.js";
import { uri } from "./__generated__/IERC1155/read/uri.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { getNFT } from "./read/getNFT.js";
import { getNFTs, isGetNFTsSupported } from "./read/getNFTs.js";
import { getOwnedTokenIds } from "./read/getOwnedTokenIds.js";
import {
  isMintAdditionalSupplyToSupported,
  mintAdditionalSupplyTo,
} from "./write/mintAdditionalSupplyTo.js";
import { mintAdditionalSupplyToBatch } from "./write/mintAdditionalSupplyToBatch.js";
import { mintTo } from "./write/mintTo.js";
import { mintToBatch } from "./write/mintToBatch.js";
import { updateTokenURI } from "./write/updateTokenURI.js";

describe.runIf(process.env.TW_SECRET_KEY)("TokenERC1155", () => {
  let contract: ThirdwebContract;

  beforeAll(async () => {
    const contractAddress = await deployERC1155Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "Test TokenERC1155",
        contractURI: TEST_CONTRACT_URI,
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

  it("isGetNFTsSupported should work with our Edition contracts", async () => {
    const abi = await resolveContractAbi<Abi>(contract);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isGetNFTsSupported(selectors)).toBe(true);
  });

  // tokenId #0 is updated in this test
  it("should update tokenURI", async () => {
    await sendAndConfirmTransaction({
      transaction: updateTokenURI({
        contract,
        newMetadata: { name: "Test1 Updated" },
        tokenId: 0n,
      }),
      account: TEST_ACCOUNT_A,
    });
    const nft = await getNFT({ contract, tokenId: 0n });
    expect(nft.metadata.name).toBe("Test1 Updated");
  });

  it("should mint with `nft` being declared as a string", async () => {
    await sendAndConfirmTransaction({
      transaction: mintTo({
        contract,
        nft: TEST_CONTRACT_URI,
        to: TEST_ACCOUNT_A.address,
        supply: 1n,
      }),
      account: TEST_ACCOUNT_A,
    });

    const tokenUri = await uri({ contract, tokenId: 2n });
    expect(tokenUri).toBe(TEST_CONTRACT_URI);
  });

  it("`isMintAdditionalSupplyToSupported` should work with our Edition contracts", async () => {
    const abi = await resolveContractAbi<Abi>(contract);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isMintAdditionalSupplyToSupported(selectors)).toBe(true);
  });

  it("should mint multiple tokens in one tx", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintToBatch({
        contract,
        to: TEST_ACCOUNT_C.address,
        nfts: [
          { metadata: { name: "batch token 0" }, supply: 1n },
          { metadata: { name: "batch token 1" }, supply: 2n },
          { metadata: { name: "batch token 2" }, supply: 3n },
        ],
      }),
    });

    const nfts = await getNFTs({ contract });
    expect(nfts).toStrictEqual([
      {
        // Updated tokenURI from the test above
        metadata: { name: "Test1 Updated" },
        owner: null,
        id: 0n,
        tokenURI: "ipfs://QmTSyt6YgoFtH8yhWgevC22BxjyrkCKuzdk86nqQJCwrV9/0",
        type: "ERC1155",
        supply: 15n,
      },
      {
        metadata: { name: "Test NFT 2" },
        owner: null,
        id: 1n,
        tokenURI: "ipfs://QmV6gsfzdiMRtpnh8ay3CgutStVbes7qoF4DKpYE64h8hT/0",
        type: "ERC1155",
        supply: 5n,
      },
      {
        metadata: {
          name: "tw-contract-name",
          symbol: "tw-contract-symbol",
          description: "tw-contract-description",
        },
        owner: null,
        id: 2n,
        // Minted using URI from the test above
        tokenURI:
          "ipfs://bafybeiewg2e3vehsb5pb34xwk25eyyfwlvajzmgz3rtdrvn3upsxnsbhzi/contractUri.json",
        type: "ERC1155",
        supply: 1n,
      },
      {
        metadata: { name: "batch token 0" },
        owner: null,
        id: 3n,
        tokenURI: "ipfs://QmPSQhC2J6Wig4pH1Lt5th19FM58J5oukhfLfpc9L1i39Q/0",
        type: "ERC1155",
        supply: 1n,
      },
      {
        metadata: { name: "batch token 1" },
        owner: null,
        id: 4n,
        tokenURI: "ipfs://QmWRQwLBAeq6Wr65Yj7A4aeYqMD1C7Hs1moz15ncS6EhGu/0",
        type: "ERC1155",
        supply: 2n,
      },
      {
        metadata: { name: "batch token 2" },
        owner: null,
        id: 5n,
        tokenURI: "ipfs://QmTg1wxKGvdZR4NrdkYZGcfB5YYaBz75DH83td5RwprMRP/0",
        type: "ERC1155",
        supply: 3n,
      },
    ]);
  });

  it("getOwnedTokenIds should work", async () => {
    const ownedTokenIds = await getOwnedTokenIds({
      contract,
      address: TEST_ACCOUNT_C.address,
    });
    expect(ownedTokenIds).toStrictEqual([
      { tokenId: 3n, balance: 1n },
      { tokenId: 4n, balance: 2n },
      { tokenId: 5n, balance: 3n },
    ]);
  });

  it("should mint multiple ADDITIONAL tokens in one tx", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintAdditionalSupplyToBatch({
        contract,
        nfts: [
          { tokenId: 3n, supply: 99n, to: TEST_ACCOUNT_C.address },
          { tokenId: 4n, supply: 94n, to: TEST_ACCOUNT_C.address },
          { tokenId: 5n, supply: 97n, to: TEST_ACCOUNT_C.address },
          { tokenId: 3n, supply: 4n, to: TEST_ACCOUNT_C.address },
        ],
      }),
    });

    const ownedTokenIds = await getOwnedTokenIds({
      contract,
      address: TEST_ACCOUNT_C.address,
    });

    expect(ownedTokenIds).toStrictEqual([
      { tokenId: 3n, balance: 104n },
      { tokenId: 4n, balance: 96n },
      { tokenId: 5n, balance: 100n },
    ]);
  });
});
