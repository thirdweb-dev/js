import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getBalance } from "../../erc20/read/getBalance.js";
import { approve } from "../../erc20/write/approve.js";
import { mintTo } from "../../erc20/write/mintTo.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { deployPublishedContract } from "../../prebuilts/deploy-published.js";
import {
  airdropERC20WithSignature,
  generateAirdropSignatureERC20,
} from "./airdropERC20WithSignature.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe
  .runIf(process.env.TW_SECRET_KEY)
  .sequential("generateAirdropSignatureERC2020", () => {
    let airdropContract: ThirdwebContract;
    let erc20TokenContract: ThirdwebContract;

    beforeAll(async () => {
      airdropContract = getContract({
        address: await deployPublishedContract({
          account: TEST_ACCOUNT_A,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "Airdrop",
          contractParams: [TEST_ACCOUNT_A.address, ""],
        }),
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      erc20TokenContract = getContract({
        address: await deployERC20Contract({
          account: TEST_ACCOUNT_A,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          params: {
            name: "TestToken",
            symbol: "TSTT",
          },
          type: "TokenERC20",
        }),
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      const mintTx = mintTo({
        contract: erc20TokenContract,
        to: TEST_ACCOUNT_A.address,
        amountWei: 1000n,
      });
      await sendAndConfirmTransaction({
        transaction: mintTx,
        account: TEST_ACCOUNT_A,
      });

      const approvalTx = approve({
        contract: erc20TokenContract,
        spender: airdropContract.address,
        amountWei: 1000n,
      });
      await sendAndConfirmTransaction({
        transaction: approvalTx,
        account: TEST_ACCOUNT_A,
      });
    }, 60000);

    it("should send airdrop of ERC20 tokens with signature", async () => {
      const contents = [
        { recipient: TEST_ACCOUNT_B.address, amount: 10n },
        { recipient: TEST_ACCOUNT_C.address, amount: 15n },
        { recipient: TEST_ACCOUNT_D.address, amount: 20n },
      ];
      const { req, signature } = await generateAirdropSignatureERC20({
        airdropRequest: {
          tokenAddress: erc20TokenContract.address,
          contents,
        },
        account: TEST_ACCOUNT_A,
        contract: airdropContract,
      });

      const transaction = airdropERC20WithSignature({
        contract: airdropContract,
        req,
        signature,
      });
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account: TEST_ACCOUNT_A,
      });

      const balanceB = (
        await getBalance({
          contract: erc20TokenContract,
          address: TEST_ACCOUNT_B.address,
        })
      ).value;

      const balanceC = (
        await getBalance({
          contract: erc20TokenContract,
          address: TEST_ACCOUNT_C.address,
        })
      ).value;

      const balanceD = (
        await getBalance({
          contract: erc20TokenContract,
          address: TEST_ACCOUNT_D.address,
        })
      ).value;

      // admin balance
      const balanceA = (
        await getBalance({
          contract: erc20TokenContract,
          address: TEST_ACCOUNT_A.address,
        })
      ).value;

      expect(balanceB).to.equal(10n);
      expect(balanceC).to.equal(15n);
      expect(balanceD).to.equal(20n);

      expect(balanceA).to.equal(1000n - balanceB - balanceC - balanceD);

      expect(transactionHash.length).toBe(66);
    });
  });
