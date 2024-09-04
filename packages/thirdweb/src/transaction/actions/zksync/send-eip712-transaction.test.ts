import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { zkSyncSepolia } from "../../../chains/chain-definitions/zksync-sepolia.js";
import { deployPublishedContract } from "../../../extensions/prebuilts/deploy-published.js";
import { prepareTransaction } from "../../prepare-transaction.js";
import { sendEip712Transaction } from "./send-eip712-transaction.js";

describe("sendEip712Transaction", () => {
  // re-enable for testing, but disable for CI since it requires testnet funds
  it.skip("should send eip712 transaction", async () => {
    const transaction = prepareTransaction({
      chain: zkSyncSepolia, // TODO make zksync fork chain work
      client: TEST_CLIENT,
      value: 0n,
      to: TEST_ACCOUNT_B.address,
      eip712: {
        paymaster: "0xbA226d47Cbb2731CBAA67C916c57d68484AA269F",
        paymasterInput:
          "0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
      },
    });
    const res = await sendEip712Transaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    expect(res.transactionHash.length).toBe(66);
  });

  it.skip("should deploy a published autofactory contract on zksync", async () => {
    const address = await deployPublishedContract({
      client: TEST_CLIENT,
      chain: zkSyncSepolia, // TODO make zksync fork chain work
      account: TEST_ACCOUNT_A,
      contractId: "DropERC1155",
      contractParams: [
        TEST_ACCOUNT_A.address, // defaultAdmin
        "test", // name
        "", // symbol
        "", // contractURI
        [], // trustedForwarders
        TEST_ACCOUNT_A.address, // saleRecipient
        TEST_ACCOUNT_A.address, // royaltyRecipient
        0n, // royaltyBps
        0n, // platformFeeBps
        TEST_ACCOUNT_A.address, // platformFeeRecipient
      ],
    });
    console.log("deployed address", address);
    expect(address).toBeDefined();
    expect(address.length).toBe(42);
  });
});
