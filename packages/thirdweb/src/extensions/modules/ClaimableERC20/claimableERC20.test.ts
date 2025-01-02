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
  type ThirdwebContract,
  getContract,
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
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC20",
      params: {
        name: "TestDropERC20",
        contractURI: TEST_CONTRACT_URI,
      },
      modules: [
        ClaimableERC20.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
      ],
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
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
        transaction: ClaimableERC20.mint({
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
      transaction: ClaimableERC20.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC20.mint({
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
      transaction: ClaimableERC20.mint({
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
      transaction: ClaimableERC20.setClaimCondition({
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
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      transaction: ClaimableERC20.mint({
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

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC20.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
        maxClaimablePerWallet: "0.1",
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC20.mint({
          contract,
          quantity: "0.12",
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      transaction: ClaimableERC20.mint({
        contract,
        quantity: "0.05",
        to: TEST_ACCOUNT_C.address,
      }),
      account: TEST_ACCOUNT_C,
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
