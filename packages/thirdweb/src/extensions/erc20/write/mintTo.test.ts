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
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { getBalance } from "../read/getBalance.js";
import { mintTo } from "./mintTo.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("ERC20.mintTo", () => {
  let erc20Contract: ThirdwebContract;

  beforeAll(async () => {
    erc20Contract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC20",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 60000);

  describe("mintTo", () => {
    it("should mint tokens to an address", async () => {
      const transaction = mintTo({
        contract: erc20Contract,
        to: TEST_ACCOUNT_A.address,
        amount: 100,
      });

      await sendAndConfirmTransaction({ transaction, account: TEST_ACCOUNT_A });

      const balance = await getBalance({
        contract: erc20Contract,
        address: TEST_ACCOUNT_A.address,
      });
      expect(balance.displayValue).toBe("100");
    });

    it("should mint tokens to an address with a specified amount in wei", async () => {
      const transaction = mintTo({
        contract: erc20Contract,
        to: TEST_ACCOUNT_B.address,
        amountWei: 100n,
      });
      await sendAndConfirmTransaction({ transaction, account: TEST_ACCOUNT_A });

      const balance = await getBalance({
        contract: erc20Contract,
        address: TEST_ACCOUNT_B.address,
      });

      expect(balance.value).toBe(100n);
    });
  });
});
