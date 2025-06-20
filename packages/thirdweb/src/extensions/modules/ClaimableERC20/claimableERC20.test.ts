import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import * as ClaimableERC20 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularDropERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      core: "ERC20",
      modules: [
        ClaimableERC20.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
      ],
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestDropERC20",
      },
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 120000);

  it("should have erc20 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(1);
  });

  it("should not claim without claim conditions", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_A.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC20.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "10",
          to: TEST_ACCOUNT_A.address,
        }),
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
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC20.mint({
        contract,
        quantity: "0.1",
        to: TEST_ACCOUNT_A.address,
      }),
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
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC20.setClaimCondition({
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC20.mint({
        contract,
        quantity: 0.2,
        to: TEST_ACCOUNT_B.address,
      }),
    });

    const balance = await getWalletBalance({
      address: TEST_ACCOUNT_B.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(200000000000000000n);
  });

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC20.setClaimCondition({
        contract,
        maxClaimablePerWallet: "0.1",
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
    });

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "0.12",
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC20.mint({
        contract,
        quantity: "0.05",
        to: TEST_ACCOUNT_C.address,
      }),
    });

    const balance = await getWalletBalance({
      address: TEST_ACCOUNT_C.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      tokenAddress: contract.address,
    });
    expect(balance.value).toBe(50000000000000000n);
  });
});
