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
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { name } from "../common/read/name.js";
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
        contractURI: TEST_CONTRACT_URI,
        name: "Edition",
      },
      type: "TokenERC1155",
    });

    expect(contractAddress).toBeDefined();
    const deployedName = await name({
      contract: getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
    });
    expect(deployedName).toBe("Edition");

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
      nft: { name: "Test NFT" },
      supply: 10n,
      to: TEST_ACCOUNT_A.address,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTx,
    });

    // now 1 token minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(1n);
    // tokenId 0 is minted
    expect((await getNFT({ contract, tokenId: 0n })).metadata.name).toBe(
      "Test NFT",
    );
    // account should have a balance of 10
    await expect(
      balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 0n }),
    ).resolves.toBe(10n);
    // totalSupply should be 10
    await expect(totalSupply({ contract, id: 0n })).resolves.toBe(10n);

    // mint additional supply
    const mintTx2 = mintAdditionalSupplyTo({
      contract,
      supply: 5n,
      to: TEST_ACCOUNT_A.address,
      tokenId: 0n,
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTx2,
    });

    // still 1 token minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(1n);
    // tokenId 0 is minted
    // supply should be 15
    // @ts-expect-error - supply is there
    expect((await getNFT({ contract, tokenId: 0n })).supply).toBe(15n);
    // account should have a balance of 15
    await expect(
      balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 0n }),
    ).resolves.toBe(15n);
    // totalSupply should be 15
    await expect(totalSupply({ contract, id: 0n })).resolves.toBe(15n);

    // mint a second token
    const mintTx3 = mintTo({
      contract,
      nft: { name: "Test NFT 2" },
      supply: 5n,
      to: TEST_ACCOUNT_B.address,
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTx3,
    });

    // now 2 tokens minted
    await expect(nextTokenIdToMint({ contract })).resolves.toBe(2n);
    await expect(getNFTs({ contract })).resolves.length(2);
    expect((await getNFT({ contract, tokenId: 0n })).metadata.name).toBe(
      "Test NFT",
    );
    expect((await getNFT({ contract, tokenId: 1n })).metadata.name).toBe(
      "Test NFT 2",
    );
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
      account: TEST_ACCOUNT_A,
      transaction: updateTokenURI({
        contract,
        newMetadata: { name: "Test1 Updated" },
        tokenId: 0n,
      }),
    });
    const nft = await getNFT({ contract, tokenId: 0n });
    expect(nft.metadata.name).toBe("Test1 Updated");
  });

  it("should mint with `nft` being declared as a string", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintTo({
        contract,
        nft: TEST_CONTRACT_URI,
        supply: 1n,
        to: TEST_ACCOUNT_A.address,
      }),
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
        nfts: [
          { metadata: { name: "batch token 0" }, supply: 1n },
          { metadata: { name: "batch token 1" }, supply: 2n },
          { metadata: { name: "batch token 2" }, supply: 3n },
        ],
        to: TEST_ACCOUNT_C.address,
      }),
    });

    const nfts = await getNFTs({ contract });
    const names = nfts.map((nft) => nft.metadata.name);
    expect(names).toContain("batch token 0");
    expect(names).toContain("batch token 1");
    expect(names).toContain("batch token 2");
  });

  it("getOwnedTokenIds should work", async () => {
    const ownedTokenIds = await getOwnedTokenIds({
      address: TEST_ACCOUNT_C.address,
      contract,
    });
    expect(ownedTokenIds).toStrictEqual([
      { balance: 1n, tokenId: 3n },
      { balance: 2n, tokenId: 4n },
      { balance: 3n, tokenId: 5n },
    ]);
  });

  it("should mint multiple ADDITIONAL tokens in one tx", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: mintAdditionalSupplyToBatch({
        contract,
        nfts: [
          { supply: 99n, to: TEST_ACCOUNT_C.address, tokenId: 3n },
          { supply: 94n, to: TEST_ACCOUNT_C.address, tokenId: 4n },
          { supply: 97n, to: TEST_ACCOUNT_C.address, tokenId: 5n },
          { supply: 4n, to: TEST_ACCOUNT_C.address, tokenId: 3n },
        ],
      }),
    });

    const ownedTokenIds = await getOwnedTokenIds({
      address: TEST_ACCOUNT_C.address,
      contract,
    });

    expect(ownedTokenIds).toStrictEqual([
      { balance: 104n, tokenId: 3n },
      { balance: 96n, tokenId: 4n },
      { balance: 100n, tokenId: 5n },
    ]);
  });
});
