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
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { getInstalledExtensions } from "../__generated__/ModularCore/read/getInstalledExtensions.js";
import { grantMinterRole } from "./grantMinterRole.js";
import { installPublishedExtension } from "./installPublishedExtension.js";
import {
  generateMintSignature,
  mintWithPermissions,
  mintWithSignature,
} from "./mintableERC20.js";

describe("MintableERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "ERC20CoreInitializable", // FIXME
      params: {
        name: "TestCoreERC20",
        symbol: "TT",
      },
      publisher: "0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264", // FIXME
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
    // add mintERC20 extension
    const transaction = installPublishedExtension({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contract,
      extensionName: "MintableERC20",
      publisherAddress: "0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264", // FIXME
    });
    await sendAndConfirmTransaction({ transaction, account: TEST_ACCOUNT_A });
  }, 120000);

  it("should have erc20 extension", async () => {
    const extensions = await getInstalledExtensions({ contract });
    expect(extensions.length).toBe(1);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: mintWithPermissions({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [TransactionError: MintableRequestUnauthorized

      contract: 0x25abe7056BcFC14d8D1901e554b8730d7772dEFc
      chainId: 31337]
    `);
  });

  it("should mint tokens with permissions", async () => {
    let balance = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(0n);

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
      transaction: mintWithPermissions({
        contract,
        quantity: "0.1",
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });

    expect(balance.value).toBe(100000000000000000n);

    await sendAndConfirmTransaction({
      transaction: mintWithPermissions({
        contract,
        quantityWei: 2000000000n,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });

    expect(balance.value).toBe(100000002000000000n);
  });

  it("should mint tokens with a signature", async () => {
    const result = await generateMintSignature({
      account: TEST_ACCOUNT_A,
      contract,
      mintRequest: {
        quantity: "0.123",
        recipient: TEST_ACCOUNT_B.address,
      },
    });

    let balance = await getWalletBalance({
      address: TEST_ACCOUNT_B.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: mintWithSignature({
        contract,
        payload: result.payload,
        signature: result.signature,
      }),
      account: TEST_ACCOUNT_B, // diff account can mint
    });

    balance = await getWalletBalance({
      address: TEST_ACCOUNT_B.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(123000000000000000n);
  });
});
