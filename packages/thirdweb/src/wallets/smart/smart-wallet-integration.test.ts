import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { typedData } from "../../../test/src/typed-data.js";
import { verifySignature } from "../../auth/verifySignature.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { baseSepolia } from "../../exports/chains.js";

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
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = arbitrumSepolia;
const client = TEST_CLIENT;
const contract = getContract({
  client,
  chain,
  address: "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3",
});
const factoryAddress = "0x564cf6453a1b0FF8DB603E92EA4BbD410dea45F3"; // pre 712

describe.runIf(process.env.TW_SECRET_KEY)(
  "SmartWallet core tests",
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
        chainId: 421614]
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
        owner: smartWalletAddress,
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
      const balance = await balanceOf({
        contract,
        owner: smartWalletAddress,
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
      expect(logs[0]?.args.signer).toBe(newAdmin.address);
      expect(logs[0]?.args.isAdmin).toBe(true);
    });

    it("can use a different factory without replay protectin", async () => {
      const wallet = smartWallet({
        chain,
        factoryAddress: factoryAddress,
        gasless: true,
      });

      // should not be able to switch chains before connecting
      await expect(
        wallet.switchChain(baseSepolia),
      ).rejects.toMatchInlineSnapshot(
        "[Error: Cannot switch chain without a previous connection]",
      );

      const newAccount = await wallet.connect({ client, personalAccount });
      const message = "hello world";
      const signature = await newAccount.signMessage({ message });
      const isValidV1 = await verifySignature({
        message,
        signature,
        address: newAccount.address,
        chain,
        client,
      });
      expect(isValidV1).toEqual(true);
      const isValidV2 = await checkContractWalletSignature({
        message,
        signature,
        contract: getContract({
          address: newAccount.address,
          chain,
          client,
        }),
      });
      expect(isValidV2).toEqual(true);

      // sign typed data
      const signatureTyped = await newAccount.signTypedData({
        ...typedData.basic,
        primaryType: "Mail",
      });
      expect(signatureTyped.length).toBe(132);

      // add admin
      const newAdmin = await generateAccount({ client });
      const receipt = await sendAndConfirmTransaction({
        account: newAccount,
        transaction: addAdmin({
          account: newAccount,
          adminAddress: newAdmin.address,
          contract: getContract({
            address: newAccount.address,
            chain,
            client,
          }),
        }),
      });
      const logs = parseEventLogs({
        events: [adminUpdatedEvent()],
        logs: receipt.logs,
      });
      expect(logs[0]?.args.signer).toBe(newAdmin.address);
      expect(logs[0]?.args.isAdmin).toBe(true);

      // should not be able to switch chains since factory not deployed elsewhere
      await expect(
        wallet.switchChain(baseSepolia),
      ).rejects.toMatchInlineSnapshot(
        "[Error: Factory contract not deployed on chain: 84532]",
      );

      // check can disconnnect
      await wallet.disconnect();
      expect(wallet.getAccount()).toBeUndefined();
    });

    it("can switch chains", async () => {
      const baseSepoliaEdition = getContract({
        address: "0x638263e3eAa3917a53630e61B1fBa685308024fa",
        chain: baseSepolia,
        client: TEST_CLIENT,
      });
      await wallet.switchChain(baseSepolia);
      const tx = await sendAndConfirmTransaction({
        transaction: claimTo({
          contract: baseSepoliaEdition,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        // biome-ignore lint/style/noNonNullAssertion: should be set after switching chains
        account: wallet.getAccount()!,
      });
      expect(tx.transactionHash).toHaveLength(66);
      const balance = await balanceOf({
        contract: baseSepoliaEdition,
        owner: smartWalletAddress,
        tokenId: 0n,
      });
      expect(balance).toEqual(1n);
    });
  },
);
