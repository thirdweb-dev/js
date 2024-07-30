import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { getClaimCondition } from "../__generated__/ClaimableERC20/read/getClaimCondition.js";
import { getSaleConfig } from "../__generated__/ClaimableERC20/read/getSaleConfig.js";
import { getInstalledExtensions } from "../__generated__/ModularCore/read/getInstalledExtensions.js";
import { claimTo, setClaimConditions } from "./claimableERC20.js";

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
    ).rejects.toThrowError(); // TODO (modular) this should be a more specific error
  });

  it("should claim tokens with default claim conditions", async () => {
    await sendAndConfirmTransaction({
      transaction: setClaimConditions({
        contract,
      }),
      account: TEST_ACCOUNT_A,
    });

    const cc = await getClaimCondition({ contract });
    console.log("cc", cc);

    const saleConfig = await getSaleConfig({ contract });
    console.log("saleConfig", saleConfig);

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
});
