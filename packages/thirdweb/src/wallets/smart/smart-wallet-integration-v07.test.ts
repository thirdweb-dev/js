import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { typedData } from "../../../test/src/typed-data.js";
import { verifySignature } from "../../auth/verify-signature.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";

import { TEST_WALLET_A } from "~test/addresses.js";
import { verifyEip1271Signature } from "../../auth/verify-hash.js";
import { verifyTypedData } from "../../auth/verify-typed-data.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import {
  addAdmin,
  adminUpdatedEvent,
} from "../../exports/extensions/erc4337.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { setContractURI } from "../../extensions/marketplace/__generated__/IMarketplace/write/setContractURI.js";
import { estimateGasCost } from "../../transaction/actions/estimate-gas-cost.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../transaction/actions/send-batch-transaction.js";
import { waitForReceipt } from "../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { hashMessage } from "../../utils/hashing/hashMessage.js";
import { hashTypedData } from "../../utils/hashing/hashTypedData.js";
import { sleep } from "../../utils/sleep.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { predictSmartAccountAddress } from "./lib/calls.js";
import { DEFAULT_ACCOUNT_FACTORY_V0_7 } from "./lib/constants.js";
import {
  confirmContractDeployment,
  deploySmartAccount,
} from "./lib/signing.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = sepolia;
const client = TEST_CLIENT;
const contract = getContract({
  client,
  chain,
  address: "0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
});

describe.runIf(process.env.TW_SECRET_KEY)(
  "SmartWallet 0.7 core tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = await generateAccount({
        client,
      });
      wallet = smartWallet({
        chain,
        gasless: true,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address;
      accountContract = getContract({
        address: smartWalletAddress,
        chain,
        client,
      });
    });

    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
      const predictedAddress = await predictSmartAccountAddress({
        client,
        chain,
        adminAddress: personalAccount.address,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      expect(predictedAddress).toEqual(smartWalletAddress);
    });

    it("can sign a msg", async () => {
      const signature = await smartAccount.signMessage({
        message: "hello world",
      });
      const isValid = await verifySignature({
        message: "hello world",
        signature,
        address: smartWalletAddress,
        chain,
        client,
      });
      expect(isValid).toEqual(true);
    });

    it("should use ERC-1271 signatures after deployment", async () => {
      await deploySmartAccount({
        chain,
        client,
        smartAccount,
        accountContract,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // pause for a second to prevent race condition

      const signature = await smartAccount.signMessage({
        message: "hello world",
      });

      const isValid = await verifyEip1271Signature({
        hash: hashMessage("hello world"),
        signature,
        contract: accountContract,
      });
      expect(isValid).toEqual(true);
    });

    it("can sign typed data", async () => {
      const signature = await smartAccount.signTypedData(typedData.basic);
      const isValid = await verifyTypedData({
        signature,
        address: smartWalletAddress,
        chain,
        client,
        ...typedData.basic,
      });
      expect(isValid).toEqual(true);
    });

    it("should use ERC-1271 typed data signatures after deployment", async () => {
      await deploySmartAccount({
        chain,
        client,
        smartAccount,
        accountContract,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // pause for a second to prevent race condition

      const signature = await smartAccount.signTypedData(typedData.basic);

      const messageHash = hashTypedData(typedData.basic);
      const isValid = await verifyEip1271Signature({
        signature,
        hash: messageHash,
        contract: accountContract,
      });
      expect(isValid).toEqual(true);
    });

    it("can send a transaction on another chain", async () => {
      const tx = await sendAndConfirmTransaction({
        transaction: prepareTransaction({
          to: TEST_WALLET_A,
          client: TEST_CLIENT,
          chain: baseSepolia,
          value: 0n,
        }),
        // biome-ignore lint/style/noNonNullAssertion: Just trust me
        account: wallet.getAccount()!,
      });
      expect(tx.transactionHash).toHaveLength(66);
    });

    it("should revert on unsuccessful transactions", async () => {
      const tx = sendAndConfirmTransaction({
        transaction: setContractURI({
          contract,
          uri: "https://example.com",
        }),
        account: smartAccount,
      });

      await expect(tx).rejects.toMatchInlineSnapshot(`
        [TransactionError: Error - Not authorized

        contract: ${contract.address}
        chainId: 11155111]
      `);
    });

    it("can execute a tx", async () => {
      const tx = await sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      expect(tx.transactionHash).toHaveLength(66);
      await confirmContractDeployment({ accountContract });
      const isDeployed = await isContractDeployed(accountContract);
      expect(isDeployed).toEqual(true);
    });

    it("can estimate a tx", async () => {
      const estimates = await estimateGasCost({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      expect(estimates.wei.toString()).not.toBe("0");
    });

    it("can execute a batched tx", async () => {
      const tx = await sendBatchTransaction({
        account: smartAccount,
        transactions: [
          claimTo({
            contract,
            quantity: 1n,
            to: smartWalletAddress,
            tokenId: 0n,
          }),
          claimTo({
            contract,
            quantity: 1n,
            to: smartWalletAddress,
            tokenId: 0n,
          }),
        ],
      });
      expect(tx.transactionHash).toHaveLength(66);
      const result = await waitForReceipt({
        client,
        transactionHash: tx.transactionHash,
        chain,
      });
      expect(result.status).toEqual("success");
    });

    it("can sign and verify 1271 with replay protection", async () => {
      const message = "hello world";
      const signature = await smartAccount.signMessage({ message });
      const isValidV1 = await verifySignature({
        message,
        signature,
        address: smartWalletAddress,
        chain,
        client,
      });
      expect(isValidV1).toEqual(true);

      // sign typed data
      const signatureTyped = await smartAccount.signTypedData({
        ...typedData.basic,
        primaryType: "Mail",
      });
      const isValidV2 = await verifyTypedData({
        signature: signatureTyped,
        address: smartWalletAddress,
        chain,
        client,
        ...typedData.basic,
      });
      expect(isValidV2).toEqual(true);

      // add admin
      const newAdmin = await generateAccount({ client });
      const receipt = await sendAndConfirmTransaction({
        account: smartAccount,
        transaction: addAdmin({
          account: smartAccount,
          adminAddress: newAdmin.address,
          contract: getContract({
            address: smartAccount.address,
            chain,
            client,
          }),
        }),
      });
      const logs = parseEventLogs({
        events: [adminUpdatedEvent()],
        logs: receipt.logs,
      });
      expect(logs.some((l) => l.args.signer === newAdmin.address)).toBe(true);
      expect(logs.some((l) => l.args.isAdmin)).toBe(true);
    });

    it("can execute a 2 tx in parallel", async () => {
      const newSmartWallet = smartWallet({
        chain,
        gasless: true,
        overrides: {
          accountSalt: "test",
        },
      });
      const newSmartAccount = await newSmartWallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const newSmartAccountContract = getContract({
        address: newSmartAccount.address,
        chain,
        client,
      });
      let isDeployed = await isContractDeployed(newSmartAccountContract);
      expect(isDeployed).toEqual(false);

      // sending transactions in parallel should deploy the account and not cause errors
      const txs = await Promise.all([
        sendAndConfirmTransaction({
          transaction: claimTo({
            contract,
            quantity: 1n,
            to: newSmartAccount.address,
            tokenId: 0n,
          }),
          account: newSmartAccount,
        }),
        sleep(1000).then(() =>
          sendAndConfirmTransaction({
            transaction: claimTo({
              contract,
              quantity: 1n,
              to: newSmartAccount.address,
              tokenId: 0n,
            }),
            account: newSmartAccount,
          }),
        ),
      ]);
      expect(txs.length).toEqual(2);
      expect(txs.every((t) => t.transactionHash.length === 66)).toBe(true);
      const result1 = await waitForReceipt({
        client,
        transactionHash: txs[0].transactionHash,
        chain,
      });
      expect(result1.status).toEqual("success");
      const result2 = await waitForReceipt({
        client,
        transactionHash: txs[1].transactionHash,
        chain,
      });
      expect(result2.status).toEqual("success");

      isDeployed = await isContractDeployed(newSmartAccountContract);
      expect(isDeployed).toEqual(true);
    });
  },
);
