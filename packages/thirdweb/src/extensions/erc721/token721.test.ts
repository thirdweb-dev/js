import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { name } from "../../extensions/common/read/name.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { parseNFT } from "../../utils/nft/parseNft.js";
import { deployERC721Contract } from "../prebuilts/deploy-erc721.js";
import { tokenURI } from "./__generated__/IERC721A/read/tokenURI.js";
import { setTokenURI } from "./__generated__/INFTMetadata/write/setTokenURI.js";
import { getNFT, isGetNFTSupported } from "./read/getNFT.js";
import { mintTo } from "./write/mintTo.js";

const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;
const account = TEST_ACCOUNT_B;

let token721Contract: ThirdwebContract;

describe.runIf(process.env.TW_SECRET_KEY)("deployERC721", () => {
  it("should deploy ERC721 token", async () => {
    const address = await deployERC721Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "NFTCollection",
      },
      type: "TokenERC721",
    });
    expect(address).toBeDefined();
    token721Contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    const deployedName = await name({ contract: token721Contract });
    expect(deployedName).toBe("NFTCollection");
  });

  it("should mint an nft when passed an object", async () => {
    const transaction = mintTo({
      contract: token721Contract,
      nft: { name: "token 0" },
      to: account.address,
    });
    await sendAndConfirmTransaction({
      account,
      transaction,
    });

    const nft = await getNFT({ contract: token721Contract, tokenId: 0n });
    expect(nft.metadata.name).toBe("token 0");
  });

  it("should mint an nft when passed a string", async () => {
    const transaction = mintTo({
      contract: token721Contract,
      nft: "ipfs://fake-token-uri",
      to: account.address,
    });
    await sendAndConfirmTransaction({
      account,
      transaction,
    });
    const _uri = await tokenURI({ contract: token721Contract, tokenId: 1n });
    expect(_uri).toBe("ipfs://fake-token-uri");
  });

  it("isGetNFTsSupported should work", async () => {
    const abi = await resolveContractAbi<Abi>(token721Contract);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isGetNFTSupported(selectors)).toBe(true);
  });

  it("should return a default value if the URI of the token doesn't exist", async () => {
    /**
     * mint a token, then purposefully change that token's URI to an empty string, using setTokenURI
     */
    await sendAndConfirmTransaction({
      account,
      transaction: setTokenURI({
        contract: token721Contract,
        tokenId: 1n,
        // Need to have some spaces because NFTMetadata.sol does not allow to update an empty value
        uri: "  ",
      }),
    });

    expect(
      await getNFT({ contract: token721Contract, tokenId: 1n }),
    ).toStrictEqual(
      parseNFT(
        {
          id: 1n,
          type: "ERC721",
          uri: "",
        },
        {
          chainId: token721Contract.chain.id,
          owner: null,
          tokenAddress: token721Contract.address,
          tokenId: 1n,
          tokenUri: "",
          type: "ERC721",
        },
      ),
    );
  });
});
