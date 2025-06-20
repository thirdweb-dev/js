import { beforeAll, describe, expect, it } from "vitest";
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
        amount: 100,
        contract: erc20Contract,
        to: TEST_ACCOUNT_A.address,
      });

      await sendAndConfirmTransaction({ account: TEST_ACCOUNT_A, transaction });

      const balance = await getBalance({
        address: TEST_ACCOUNT_A.address,
        contract: erc20Contract,
      });
      expect(balance.displayValue).toBe("100");
    });

    it("should mint tokens to an address with a specified amount in wei", async () => {
      const transaction = mintTo({
        amountWei: 100n,
        contract: erc20Contract,
        to: TEST_ACCOUNT_B.address,
      });
      await sendAndConfirmTransaction({ account: TEST_ACCOUNT_A, transaction });

      const balance = await getBalance({
        address: TEST_ACCOUNT_B.address,
        contract: erc20Contract,
      });

      expect(balance.value).toBe(100n);
    });
  });
});
