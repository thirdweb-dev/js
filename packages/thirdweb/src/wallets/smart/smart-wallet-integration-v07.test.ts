import { beforeAll, describe, expect, it } from "vitest";
import { TEST_WALLET_A } from "~test/addresses.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { typedData } from "../../../test/src/typed-data.js";
import { verifyEip1271Signature } from "../../auth/verify-hash.js";
import { verifySignature } from "../../auth/verify-signature.js";
import { verifyTypedData } from "../../auth/verify-typed-data.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import {
  addAdmin,
  adminUpdatedEvent,
} from "../../exports/extensions/erc4337.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { setContractURI } from "../../extensions/marketplace/__generated__/IMarketplace/write/setContractURI.js";
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
import { estimateUserOpGasCost } from "./lib/bundler.js";
import { predictSmartAccountAddress } from "./lib/calls.js";
import { DEFAULT_ACCOUNT_FACTORY_V0_7 } from "./lib/constants.js";
import {
  confirmContractDeployment,
  deploySmartAccount,
} from "./lib/signing.js";
import { createAndSignUserOp } from "./lib/userop.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = arbitrumSepolia;
const client = TEST_CLIENT;
const contract = getContract({
  address: "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3",
  chain,
  client,
});

describe.runIf(process.env.TW_SECRET_KEY).sequential(
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
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
        gasless: true,
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
        adminAddress: personalAccount.address,
        chain,
        client,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      expect(predictedAddress).toEqual(smartWalletAddress);
    });

    it("can estimate gas cost", async () => {
      const gasCost = await estimateUserOpGasCost({
        adminAccount: personalAccount,
        client: TEST_CLIENT,
        smartWalletOptions: {
          chain,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
          sponsorGas: true,
        },
        transactions: [
          claimTo({
            contract,
            quantity: 1n,
            to: smartWalletAddress,
            tokenId: 0n,
          }),
        ],
      });
      expect(gasCost.ether).not.toBe("0");
    });

    it("can sign a msg", async () => {
      const signature = await smartAccount.signMessage({
        message: "hello world",
      });
      const isValid = await verifySignature({
        address: smartWalletAddress,
        chain,
        client,
        message: "hello world",
        signature,
      });
      expect(isValid).toEqual(true);
    });

    it("should use ERC-1271 signatures after deployment", async () => {
      await deploySmartAccount({
        accountContract,
        chain,
        client,
        smartAccount,
      });
      await new Promise((resolve) => setTimeout(resolve, 3000)); // pause for a second to prevent race condition

      expect(await isContractDeployed(accountContract)).toEqual(true);

      const signature = await smartAccount.signMessage({
        message: "hello world",
      });

      const isValid = await verifyEip1271Signature({
        contract: accountContract,
        hash: hashMessage("hello world"),
        signature,
      });
      expect(isValid).toEqual(true);
    });

    it("can sign typed data", async () => {
      const signature = await smartAccount.signTypedData(typedData.basic);
      const isValid = await verifyTypedData({
        address: smartWalletAddress,
        chain,
        client,
        signature,
        ...typedData.basic,
      });
      expect(isValid).toEqual(true);
    });

    it("should use ERC-1271 typed data signatures after deployment", async () => {
      await deploySmartAccount({
        accountContract,
        chain,
        client,
        smartAccount,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // pause for a second to prevent race condition

      const signature = await smartAccount.signTypedData(typedData.basic);

      const messageHash = hashTypedData(typedData.basic);
      const isValid = await verifyEip1271Signature({
        contract: accountContract,
        hash: messageHash,
        signature,
      });
      expect(isValid).toEqual(true);
    });

    it("can send a transaction on another chain", async () => {
      const tx = await sendAndConfirmTransaction({
        // biome-ignore lint/style/noNonNullAssertion: Just trust me
        account: wallet.getAccount()!,
        transaction: prepareTransaction({
          chain: baseSepolia,
          client: TEST_CLIENT,
          to: TEST_WALLET_A,
          value: 0n,
        }),
      });
      expect(tx.transactionHash).toHaveLength(66);
    });

    it("should revert on unsuccessful transactions", async () => {
      const tx = sendAndConfirmTransaction({
        account: smartAccount,
        transaction: setContractURI({
          contract,
          uri: "https://example.com",
        }),
      });

      await expect(tx).rejects.toMatchInlineSnapshot(`
        [TransactionError: Error - Not authorized

        contract: ${contract.address}
        chainId: 421614]
      `);
    });

    it("can execute a tx", async () => {
      const tx = await sendAndConfirmTransaction({
        account: smartAccount,
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
      });
      expect(tx.transactionHash).toHaveLength(66);
      await confirmContractDeployment({ accountContract });
      const isDeployed = await isContractDeployed(accountContract);
      expect(isDeployed).toEqual(true);
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
        chain,
        client,
        transactionHash: tx.transactionHash,
      });
      expect(result.status).toEqual("success");
    });

    it("can sign and verify 1271 with replay protection", async () => {
      const message = "hello world";
      const signature = await smartAccount.signMessage({ message });
      const isValidV1 = await verifySignature({
        address: smartWalletAddress,
        chain,
        client,
        message,
        signature,
      });
      expect(isValidV1).toEqual(true);

      // sign typed data
      const signatureTyped = await smartAccount.signTypedData({
        ...typedData.basic,
        primaryType: "Mail",
      });
      const isValidV2 = await verifyTypedData({
        address: smartWalletAddress,
        chain,
        client,
        signature: signatureTyped,
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
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
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
          account: newSmartAccount,
          transaction: claimTo({
            contract,
            quantity: 1n,
            to: newSmartAccount.address,
            tokenId: 0n,
          }),
        }),
        sleep(1000).then(() =>
          sendAndConfirmTransaction({
            account: newSmartAccount,
            transaction: claimTo({
              contract,
              quantity: 1n,
              to: newSmartAccount.address,
              tokenId: 0n,
            }),
          }),
        ),
      ]);
      expect(txs.length).toEqual(2);
      expect(txs.every((t) => t.transactionHash.length === 66)).toBe(true);
      const result1 = await waitForReceipt({
        chain,
        client,
        transactionHash: txs[0].transactionHash,
      });
      expect(result1.status).toEqual("success");
      const result2 = await waitForReceipt({
        chain,
        client,
        transactionHash: txs[1].transactionHash,
      });
      expect(result2.status).toEqual("success");

      isDeployed = await isContractDeployed(newSmartAccountContract);
      expect(isDeployed).toEqual(true);
    });

    it("can prep a 0.7 userop", async () => {
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });
      const uo = await createAndSignUserOp({
        adminAccount: personalAccount,
        client: TEST_CLIENT,
        smartWalletOptions: {
          chain,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
          sponsorGas: true,
        },
        transactions: [tx],
      });
      expect(uo.callData.length).toBeGreaterThan(0);
    });
  },
);
