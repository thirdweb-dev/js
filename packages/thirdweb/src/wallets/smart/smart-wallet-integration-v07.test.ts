import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { typedData } from "../../../test/src/typed-data.js";
import { verifySignature } from "../../auth/verify-signature.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";

import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import {
  addAdmin,
  adminUpdatedEvent,
} from "../../exports/extensions/erc4337.js";
import { balanceOf } from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOf.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { checkContractWalletSignature } from "../../extensions/erc1271/checkContractWalletSignature.js";
import { setContractURI } from "../../extensions/marketplace/__generated__/IMarketplace/write/setContractURI.js";
import { estimateGasCost } from "../../transaction/actions/estimate-gas-cost.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../transaction/actions/send-batch-transaction.js";
import { waitForReceipt } from "../../transaction/actions/wait-for-tx-receipt.js";
import { getAddress } from "../../utils/address.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { sleep } from "../../utils/sleep.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { ENTRYPOINT_ADDRESS_v0_7 } from "./lib/constants.js";
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
        gasless: true,
        overrides: {
          entrypointAddress: ENTRYPOINT_ADDRESS_v0_7,
        },
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
      const isDeployed = await isContractDeployed(accountContract);
      expect(isDeployed).toEqual(true);
      const balance = await balanceOf({
        contract,
        owner: getAddress(smartWalletAddress),
        tokenId: 0n,
      });
      expect(balance).toEqual(1n);
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
      await waitForReceipt({
        client,
        transactionHash: tx.transactionHash,
        chain,
      });
      const balance = await balanceOf({
        contract,
        owner: getAddress(smartWalletAddress),
        tokenId: 0n,
      });
      expect(balance).toEqual(3n);
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
      const isValidV2 = await checkContractWalletSignature({
        message,
        signature,
        contract: accountContract,
      });
      expect(isValidV2).toEqual(true);

      // sign typed data
      const signatureTyped = await smartAccount.signTypedData({
        ...typedData.basic,
        primaryType: "Mail",
      });
      expect(signatureTyped.length).toBe(132);

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
      console.log("newSmartAccount", newSmartAccount.address);
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

      isDeployed = await isContractDeployed(newSmartAccountContract);
      expect(isDeployed).toEqual(true);
      const balance = await balanceOf({
        contract,
        owner: newSmartAccountContract.address,
        tokenId: 0n,
      });
      expect(balance).toEqual(2n);
    });
  },
);
