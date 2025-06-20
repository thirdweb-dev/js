import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getWalletBalance } from "../../../wallets/utils/getWalletBalance.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import { grantMinterRole } from "../common/grantMinterRole.js";
import * as MintableERC20 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularTokenERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      core: "ERC20",
      modules: [
        MintableERC20.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
      ],
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestTokenERC20",
        symbol: "TT",
      },
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 120000);

  it("should have erc20 module", async () => {
    const moduless = await getInstalledModules({ contract });
    expect(moduless.length).toBe(1);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: MintableERC20.mintWithRole({
          contract,
          quantity: "0.1",
          to: TEST_ACCOUNT_A.address,
        }),
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
      account: TEST_ACCOUNT_A,
      transaction: grantMinterRole({
        contract,
        user: TEST_ACCOUNT_A.address,
      }),
    });

    // mint
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: MintableERC20.mintWithRole({
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

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: MintableERC20.mintWithRole({
        contract,
        quantityWei: 2000000000n,
        to: TEST_ACCOUNT_A.address,
      }),
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
    const result = await MintableERC20.generateMintSignature({
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
      account: TEST_ACCOUNT_B,
      transaction: MintableERC20.mintWithSignature({
        contract,
        payload: result.payload,
        signature: result.signature,
      }), // diff account can mint
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
