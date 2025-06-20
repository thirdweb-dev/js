import { type ThirdwebContract, getContract } from "src/contract/contract.js";
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
import { createTokenByImplConfig } from "./create-token-by-impl-config.js";
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
      const tokenAddress = await createTokenByImplConfig({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
        params: {
          name: "Test",
          maxSupply: 10_000_000_000n,
        },
        salt: "salt123",
      });

      token = getContract({
        address: tokenAddress,
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
      });

      // approve tokens to entrypoint for distribution
      const entrypoint = await getDeployedEntrypointERC20({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      const approvalTx = approve({
        contract: token,
        spender: entrypoint?.address as string,
        amountWei: toUnits("1000", 18),
      });
      await sendAndConfirmTransaction({
        transaction: approvalTx,
        account: TEST_ACCOUNT_A,
      });
    }, 20000);

    it("should distrbute tokens to specified recipients", async () => {
      const contents = [
        { recipient: TEST_ACCOUNT_B.address, amount: 10n },
        { recipient: TEST_ACCOUNT_C.address, amount: 15n },
        { recipient: TEST_ACCOUNT_D.address, amount: 20n },
      ];

      const transaction = await distributeToken({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        tokenAddress: token.address,
        contents,
      });

      await sendAndConfirmTransaction({ transaction, account: TEST_ACCOUNT_A });

      const balanceB = (
        await getBalance({
          contract: token,
          address: TEST_ACCOUNT_B.address,
        })
      ).value;

      const balanceC = (
        await getBalance({
          contract: token,
          address: TEST_ACCOUNT_C.address,
        })
      ).value;

      const balanceD = (
        await getBalance({
          contract: token,
          address: TEST_ACCOUNT_D.address,
        })
      ).value;

      // admin balance
      const balanceA = (
        await getBalance({
          contract: token,
          address: TEST_ACCOUNT_A.address,
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
