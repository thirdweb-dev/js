import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { getInstalledExtensions } from "../__generated__/ModularCore/read/getInstalledExtensions.js";
import { grantMinterRole } from "./grantMinterRole.js";
import {
  generateMintSignature,
  mintWithRole,
  mintWithSignature,
} from "./mintableERC721.js";

describe("ModularTokenERC721", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC721Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "ModularTokenERC721",
      params: {
        name: "TestTokenERC721",
        symbol: "TT",
      },
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
  }, 1721000);

  it("should have erc721 extension", async () => {
    const extensions = await getInstalledExtensions({ contract });
    expect(extensions.length).toBe(3);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: mintWithRole({
          contract,
          nfts: ["ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a"],
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/MintableRequestUnauthorized/);
  });

  it("should mint tokens with permissions", async () => {
    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
    });
    expect(balance).toBe(0n);

    // grant minter role
    await sendAndConfirmTransaction({
      transaction: grantMinterRole({
        contract,
        user: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    // mint
    await sendAndConfirmTransaction({
      transaction: mintWithRole({
        contract,
        nfts: ["ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a"],
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
    });

    expect(balance).toBe(1n);
  });

  it("should mint tokens with a signature", async () => {
    const result = await generateMintSignature({
      account: TEST_ACCOUNT_A,
      contract,
      nfts: ["ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a"],
      mintRequest: {
        recipient: TEST_ACCOUNT_B.address,
      },
    });

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
    });
    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: mintWithSignature({
        contract,
        ...result,
      }),
      account: TEST_ACCOUNT_B, // diff account can mint
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
    });
    expect(balance).toBe(1n);
  });
});
