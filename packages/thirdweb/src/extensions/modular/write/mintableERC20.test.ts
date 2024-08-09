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
import {
  generateMintSignature,
  mintWithRole,
  mintWithSignature,
} from "./mintableERC20.js";

describe("ModularTokenERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "ModularTokenERC20",
      params: {
        name: "TestTokenERC20",
        symbol: "TT",
      },
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
  }, 120000);

  it("should have erc20 extension", async () => {
    const extensions = await getInstalledExtensions({ contract });
    expect(extensions.length).toBe(2);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: mintWithRole({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/MintableRequestUnauthorized/);
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
      transaction: mintWithRole({
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
      transaction: mintWithRole({
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
