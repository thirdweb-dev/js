import { beforeAll, describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN_WITH_MINING } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { mintTo } from "../../../../extensions/erc20/write/mintTo.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import { isHex } from "../../../../utils/encoding/hex.js";
import { sendAndConfirmTransaction } from "../../send-and-confirm-transaction.js";
import { toSerializableTransaction } from "../../to-serializable-transaction.js";
import { prepareBiconomyTransaction } from "./biconomy.js";

describe.runIf(process.env.TW_SECRET_KEY)("prepareBiconomyTransaction", () => {
  let erc20Contract: ThirdwebContract;
  beforeAll(async () => {
    erc20Contract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: FORKED_ETHEREUM_CHAIN_WITH_MINING,
        client: TEST_CLIENT,
        params: { name: "Test Token", symbol: "TST" },
        type: "TokenERC20",
      }),
      chain: FORKED_ETHEREUM_CHAIN_WITH_MINING,
      client: TEST_CLIENT,
    });
    // mint some tokens to the account
    await sendAndConfirmTransaction({
      transaction: mintTo({
        contract: erc20Contract,
        amount: "1000",
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });
  }, 60_000);
  it("should prepare a Biconomy transaction", async () => {
    const transaction = transfer({
      amount: "100",
      contract: erc20Contract,
      to: TEST_ACCOUNT_B.address,
    });

    // seralizable transaction
    const serializableTransaction = await toSerializableTransaction({
      transaction,
      from: TEST_ACCOUNT_A.address,
    });

    const result = await prepareBiconomyTransaction({
      account: TEST_ACCOUNT_A,
      serializableTransaction,
      transaction,
      gasless: {
        apiId: "TEST_ID",
        apiKey: "TEST_KEY",
        // mainnet forwarder address
        relayerForwarderAddress: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
        provider: "biconomy",
      },
    });

    const [request, signature] = result;

    expect(isHex(signature)).toBe(true);
    expect(request.batchId).toBe(0n);
    expect(request.batchNonce).toBe(0n);
    expect(request.data).toMatchInlineSnapshot(
      `"0xa9059cbb00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000056bc75e2d63100000"`,
    );
    expect(request.deadline).toBeGreaterThan(0);
    expect(request.from).toBe(TEST_ACCOUNT_A.address);
    expect(request.to).toBe(erc20Contract.address);
  });
});
