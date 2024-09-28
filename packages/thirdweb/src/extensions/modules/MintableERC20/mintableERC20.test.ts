import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
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
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import { grantMinterRole } from "../common/grantMinterRole.js";
import * as MintableERC20 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularTokenERC20", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC20",
      params: {
        name: "TestTokenERC20",
        symbol: "TT",
        contractURI: TEST_CONTRACT_URI,
      },
      modules: [
        MintableERC20.module({
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
    const moduless = await getInstalledModules({ contract });
    expect(moduless.length).toBe(1);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: MintableERC20.mintWithRole({
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
      transaction: MintableERC20.mintWithRole({
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
      transaction: MintableERC20.mintWithRole({
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
      transaction: MintableERC20.mintWithSignature({
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
