import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { getInstalledExtensions } from "../__generated__/ModularCore/read/getInstalledExtensions.js";
import { claimTo, setClaimCondition } from "./claimableERC20.js";

describe("ModularDropERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployERC20Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      type: "ModularDropERC20",
      params: {
        name: "TestDropERC20",
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

  it("should not claim without claim conditions", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      transaction: setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: "10",
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    let balance = await getWalletBalance({
      address: TEST_ACCOUNT_A.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });

    expect(balance.value).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: claimTo({
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
  });

  it("should claim tokens with allowlist", async () => {
    await sendAndConfirmTransaction({
      transaction: setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      transaction: claimTo({
        contract,
        quantity: 0.2,
        to: TEST_ACCOUNT_B.address,
      }),
      account: TEST_ACCOUNT_C,
    });

    const balance = await getWalletBalance({
      address: TEST_ACCOUNT_B.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(200000000000000000n);
  });
});
