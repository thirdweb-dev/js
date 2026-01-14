import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { zkSyncSepolia } from "../../../chains/chain-definitions/zksync-sepolia.js";
import { defineChain } from "../../../chains/utils.js";
import { deployPublishedContract } from "../../../extensions/prebuilts/deploy-published.js";
import { prepareTransaction } from "../../prepare-transaction.js";
import {
  getZkGasFees,
  sendEip712Transaction,
} from "./send-eip712-transaction.js";

describe("sendEip712Transaction", () => {
  // re-enable for testing, but disable for CI since it requires testnet funds
  it.skip("should send eip712 transaction", async () => {
    const transaction = prepareTransaction({
      chain: zkSyncSepolia, // TODO make zksync fork chain work
      client: TEST_CLIENT,
      eip712: {
        paymaster: "0xbA226d47Cbb2731CBAA67C916c57d68484AA269F",
        paymasterInput:
          "0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
      },
      to: TEST_ACCOUNT_B.address,
      value: 0n,
    });
    const res = await sendEip712Transaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    expect(res.transactionHash.length).toBe(66);
  });

  it.skip("should deploy a published autofactory contract on zksync", async () => {
    const address = await deployPublishedContract({
      account: TEST_ACCOUNT_A,
      chain: zkSyncSepolia, // TODO make zksync fork chain work
      client: TEST_CLIENT,
      contractId: "DropERC721",
      contractParams: {
        contractURI: "", // defaultAdmin
        defaultAdmin: TEST_ACCOUNT_A.address, // name
        name: "test", // symbol
        platformFeeBps: 0n, // contractURI
        platformFeeRecipient: TEST_ACCOUNT_A.address, // trustedForwarders
        royaltyBps: 0n, // saleRecipient
        royaltyRecipient: TEST_ACCOUNT_A.address, // royaltyRecipient
        saleRecipient: TEST_ACCOUNT_A.address, // royaltyBps
        symbol: "test", // platformFeeBps
        trustedForwarders: [], // platformFeeRecipient
      },
    });
    expect(address).toBeDefined();
    expect(address.length).toBe(42);
  });

  it("should fallback to standard EVM methods when zks_estimateFee is not available", async () => {
    // Chain 278701 is a zkSync chain that doesn't support zks_estimateFee
    const zkSyncChainWithoutZksSupport = defineChain(278701);

    // Use a transaction with pre-defined gas to skip estimation (which requires balance)
    // This tests that the fallback path is taken for fee estimation
    const transaction = prepareTransaction({
      chain: zkSyncChainWithoutZksSupport,
      client: TEST_CLIENT,
      gas: 21000n, // pre-define gas to skip eth_estimateGas
      to: TEST_ACCOUNT_B.address,
      value: 0n,
    });

    const gasFees = await getZkGasFees({
      transaction,
      from: TEST_ACCOUNT_A.address as `0x${string}`,
    });

    // Verify fallback worked - should have valid gas values
    expect(gasFees.gas).toBeDefined();
    expect(gasFees.gas).toBeGreaterThan(0n);
    expect(gasFees.maxFeePerGas).toBeDefined();
    expect(gasFees.maxFeePerGas).toBeGreaterThan(0n);
    expect(gasFees.maxPriorityFeePerGas).toBeDefined();
    expect(gasFees.maxPriorityFeePerGas).toBeGreaterThan(0n);
    // Fallback should use 100k for gasPerPubdata
    expect(gasFees.gasPerPubdata).toBe(100000n);
  });
});
