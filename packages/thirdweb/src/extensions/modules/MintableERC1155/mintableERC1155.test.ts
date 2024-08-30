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
import { getAddress } from "../../../utils/address.js";
import { balanceOf } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import { grantMinterRole } from "../common/grantMinterRole.js";
import * as MintableERC1155 from "./index.js";

describe("ModularTokenERC1155", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC1155",
      params: {
        name: "TestTokenERC1155",
        symbol: "TT",
      },
      modules: [
        MintableERC1155.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
      ],
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
  }, 11155000);

  it("should have erc1155 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(1);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: MintableERC1155.mintWithRole({
          contract,
          nft: "ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a",
          amount: 10n,
          tokenId: 0n,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/MintableRequestUnauthorized/);
  });

  it("should mint tokens with permissions", async () => {
    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      tokenId: 0n,
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
      transaction: MintableERC1155.mintWithRole({
        contract,
        nft: "ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a",
        amount: 10n,
        tokenId: 0n,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
      tokenId: 0n,
    });

    expect(balance).toBe(10n);
  });

  it("should mint tokens with a signature", async () => {
    const result = await MintableERC1155.generateMintSignature({
      account: TEST_ACCOUNT_A,
      contract,
      nft: "ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a",
      mintRequest: {
        recipient: getAddress(TEST_ACCOUNT_B.address),
        quantity: 10n,
        tokenId: 1n,
      },
    });

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
      tokenId: 1n,
    });
    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: MintableERC1155.mintWithSignature({
        contract,
        ...result,
      }),
      account: TEST_ACCOUNT_B, // diff account can mint
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
      tokenId: 1n,
    });
    expect(balance).toBe(10n);
  });
});
