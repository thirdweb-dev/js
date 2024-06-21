import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";

import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { deployERC721Contract } from "../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { tokenURI } from "../__generated__/IERC721A/read/tokenURI.js";
import { getNFT } from "../read/getNFT.js";
import { mintTo } from "./mintTo.js";

let contract: ThirdwebContract;
const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(!!process.env.TW_SECRET_KEY)("erc721 mintTo extension", () => {
  beforeEach(async () => {
    const address = await deployERC721Contract({
      client,
      chain,
      account,
      type: "TokenERC721",
      params: {
        name: "NFTDrop",
      },
    });
    contract = getContract({
      address,
      client,
      chain,
    });
  });

  it("should mint an nft when passed an object", async () => {
    const transaction = mintTo({
      contract,
      nft: { name: "token 0" },
      to: account.address,
    });
    await sendAndConfirmTransaction({
      transaction,
      account,
    });

    const nft = await getNFT({ contract, tokenId: 0n });
    expect(nft.metadata.name).toBe("token 0");
  });

  it("should mint an nft when passed a string", async () => {
    const transaction = mintTo({
      contract,
      nft: "ipfs://fake-token-uri",
      to: account.address,
    });
    await sendAndConfirmTransaction({
      transaction,
      account,
    });
    const _uri = await tokenURI({ contract, tokenId: 0n });
    expect(_uri).toBe("ipfs://fake-token-uri");
  });
});
