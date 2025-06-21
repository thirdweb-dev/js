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
  getContract,
  type ThirdwebContract,
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
          contractParams: {
            contractURI: "",
            defaultAdmin: TEST_ACCOUNT_A.address,
          },
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
        amountWei: 1000n,
        contract: erc20TokenContract,
        to: TEST_ACCOUNT_A.address,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: mintTx,
      });

      const approvalTx = approve({
        amountWei: 1000n,
        contract: erc20TokenContract,
        spender: airdropContract.address,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: approvalTx,
      });
    }, 60000);

    it("should send airdrop of ERC20 tokens with signature", async () => {
      const contents = [
        { amount: 10n, recipient: TEST_ACCOUNT_B.address },
        { amount: 15n, recipient: TEST_ACCOUNT_C.address },
        { amount: 20n, recipient: TEST_ACCOUNT_D.address },
      ];
      const { req, signature } = await generateAirdropSignatureERC20({
        account: TEST_ACCOUNT_A,
        airdropRequest: {
          contents,
          tokenAddress: erc20TokenContract.address,
        },
        contract: airdropContract,
      });

      const transaction = airdropERC20WithSignature({
        contract: airdropContract,
        req,
        signature,
      });
      const { transactionHash } = await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
      });

      const balanceB = (
        await getBalance({
          address: TEST_ACCOUNT_B.address,
          contract: erc20TokenContract,
        })
      ).value;

      const balanceC = (
        await getBalance({
          address: TEST_ACCOUNT_C.address,
          contract: erc20TokenContract,
        })
      ).value;

      const balanceD = (
        await getBalance({
          address: TEST_ACCOUNT_D.address,
          contract: erc20TokenContract,
        })
      ).value;

      // admin balance
      const balanceA = (
        await getBalance({
          address: TEST_ACCOUNT_A.address,
          contract: erc20TokenContract,
        })
      ).value;

      expect(balanceB).to.equal(10n);
      expect(balanceC).to.equal(15n);
      expect(balanceD).to.equal(20n);

      expect(balanceA).to.equal(1000n - balanceB - balanceC - balanceD);

      expect(transactionHash.length).toBe(66);
    });
  });
