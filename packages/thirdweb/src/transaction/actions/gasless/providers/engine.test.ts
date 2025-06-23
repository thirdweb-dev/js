import { beforeAll, describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN_WITH_MINING } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../contract/contract.js";
import { polygon } from "../../../../exports/chains.js";
import { generateAccount } from "../../../../exports/wallets.js";
import { mintTo } from "../../../../extensions/erc20/write/mintTo.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import { add } from "../../../../extensions/thirdweb/__generated__/ITWMultichainRegistry/write/add.js";
import { isHex } from "../../../../utils/encoding/hex.js";
import { sendAndConfirmTransaction } from "../../send-and-confirm-transaction.js";
import { sendTransaction } from "../../send-transaction.js";
import { toSerializableTransaction } from "../../to-serializable-transaction.js";
import { prepareEngineTransaction } from "./engine.js";

describe.runIf(process.env.TW_SECRET_KEY)("prepareengineTransaction", () => {
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
      account: TEST_ACCOUNT_A,
      transaction: mintTo({
        amount: "1000",
        contract: erc20Contract,
        to: TEST_ACCOUNT_A.address,
      }),
    });
  }, 60_000);

  it("should prepare an engine relay transaction", async () => {
    const transaction = transfer({
      amount: "100",
      contract: erc20Contract,
      to: TEST_ACCOUNT_B.address,
    });

    // seralizable transaction
    const serializableTransaction = await toSerializableTransaction({
      from: TEST_ACCOUNT_A.address,
      transaction,
    });

    const result = await prepareEngineTransaction({
      account: TEST_ACCOUNT_A,
      gasless: {
        provider: "engine",
        // mainnet forwarder address
        relayerForwarderAddress: "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81",
        relayerUrl: "https://safe-transaction.engine.com/api/v1",
      },
      serializableTransaction,
      transaction,
    });

    const { message, messageType, signature } = result;

    expect(isHex(signature)).toBe(true);
    expect(message.data).toBe(
      "0xa9059cbb00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000056bc75e2d63100000",
    );
    expect(message.from).toBe(TEST_ACCOUNT_A.address);
    expect(message.to).toBe(erc20Contract.address);
    expect(message.value).toBe(0n);
    expect(messageType).toMatchInlineSnapshot(`"forward"`);
  });

  // This is more of an integration test, re-enable to test relaying functionality
  it.skip("should send a real tx", async () => {
    const multichainRegistry = getContract({
      address: "0xcdAD8FA86e18538aC207872E8ff3536501431B73",
      chain: polygon,
      client: TEST_CLIENT,
    });
    const transaction = add({
      chainId: 1337n,
      contract: multichainRegistry,
      deployer: TEST_ACCOUNT_A.address,
      deployment: (await generateAccount({ client: TEST_CLIENT })).address,
      metadataUri: "",
    });
    const res = await sendTransaction({
      account: TEST_ACCOUNT_A,
      gasless: {
        experimentalChainlessSupport: true,
        provider: "engine",
        relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
        relayerUrl:
          "https://checkout.engine.thirdweb.com/relayer/0c2bdd3a-307f-4243-b6e5-5ba495222d2b",
      },
      transaction,
    });
    expect(res.transactionHash).toBeDefined();
    expect(res.transactionHash.length).toBe(66);
  });
});
