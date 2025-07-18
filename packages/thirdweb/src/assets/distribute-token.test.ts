import { getContract, type ThirdwebContract } from "src/contract/contract.js";
import { getBalance } from "src/extensions/erc20/read/getBalance.js";
import { approve } from "src/extensions/erc20/write/approve.js";
import { sendAndConfirmTransaction } from "src/transaction/actions/send-and-confirm-transaction.js";
import { toUnits } from "src/utils/units.js";
import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../test/src/test-wallets.js";
import { createTokenByImplementationConfig } from "./create-token-by-impl-config.js";
import { distributeToken } from "./distribute-token.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "create token by impl config",
  {
    timeout: 20000,
  },
  () => {
    let token: ThirdwebContract;
    beforeAll(async () => {
      // create token
      const tokenAddress = await createTokenByImplementationConfig({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          maxSupply: 10_000_000_000n,
          name: "Test",
        },
        salt: "salt123",
        implementationAddress: "0x",
      });

      token = getContract({
        address: tokenAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      // approve tokens to entrypoint for distribution
      const entrypoint = await getDeployedEntrypointERC20({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      const approvalTx = approve({
        amountWei: toUnits("1000", 18),
        contract: token,
        spender: entrypoint?.address as string,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: approvalTx,
      });
    }, 20000);

    it("should distrbute tokens to specified recipients", async () => {
      const contents = [
        { amount: 10n, recipient: TEST_ACCOUNT_B.address },
        { amount: 15n, recipient: TEST_ACCOUNT_C.address },
        { amount: 20n, recipient: TEST_ACCOUNT_D.address },
      ];

      const transaction = await distributeToken({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contents,
        tokenAddress: token.address,
      });

      await sendAndConfirmTransaction({ account: TEST_ACCOUNT_A, transaction });

      const balanceB = (
        await getBalance({
          address: TEST_ACCOUNT_B.address,
          contract: token,
        })
      ).value;

      const balanceC = (
        await getBalance({
          address: TEST_ACCOUNT_C.address,
          contract: token,
        })
      ).value;

      const balanceD = (
        await getBalance({
          address: TEST_ACCOUNT_D.address,
          contract: token,
        })
      ).value;

      // admin balance
      const balanceA = (
        await getBalance({
          address: TEST_ACCOUNT_A.address,
          contract: token,
        })
      ).value;

      expect(balanceB).to.equal(toUnits("10", 18));
      expect(balanceC).to.equal(toUnits("15", 18));
      expect(balanceD).to.equal(toUnits("20", 18));

      expect(balanceA).to.equal(
        toUnits("10000000000", 18) - balanceB - balanceC - balanceD,
      );
    });
  },
);
