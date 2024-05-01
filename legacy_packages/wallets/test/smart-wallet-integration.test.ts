/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";
import { checkContractWalletSignature } from "../src/evm/connectors/smart-wallet/lib/check-contract-wallet-signature";
import { describe, it, expect, beforeAll } from "vitest";

require("dotenv-mono").load();

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let contract: SmartContract;
const factoryAddress = "0x7b5ba9D46b53aae55e2c2E9b38d9AfF9a0b158F8"; // pre 712
const factoryAddressV2 = "0xBCE06A6Dcd4dE8c6D8892E404b0a99A8812352b2"; // post 712
const chain = BaseSepoliaTestnet;
const SECRET_KEY = process.env.TW_SECRET_KEY;

const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

beforeAll(async () => {
  personalWallet = new LocalWallet();
  await personalWallet.generate();
  smartWallet = new SmartWallet({
    chain,
    factoryAddress,
    gasless: true,
    secretKey: SECRET_KEY,
  });
  smartWalletAddress = await smartWallet.connect({ personalWallet });
  const sdk = await ThirdwebSDK.fromWallet(smartWallet, chain, {
    secretKey: SECRET_KEY,
  });
  contract = await sdk.getContract(
    "0x638263e3eAa3917a53630e61B1fBa685308024fa", // edition drop
  );
});

describeIf(!!SECRET_KEY)(
  "SmartWallet core tests",
  () => {
    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
    });

    it("can execute a tx via SDK", {
      timeout: 120_000,
    }, async () => {
      const tx = await contract.erc1155.claim(0, 1);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const isDeployed = await smartWallet.isDeployed();
      expect(isDeployed).toEqual(true);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(1);
    });

    it("can estimate a tx", {
      timeout: 120_000,
    }, async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const estimates = await smartWallet.estimate(preparedTx);
      expect(estimates.wei.toString()).not.toBe("0");
    });

    it("can execute a tx", {
      timeout: 120_000,
    }, async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.execute(preparedTx);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(2);
    });

    it("can execute a batched tx", {
      timeout: 120_000,
    }, async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.executeBatch([preparedTx, preparedTx]);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(4);
    });

    it("can execute a raw tx", {
      timeout: 120_000,
    }, async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.executeRaw({
        to: preparedTx.getTarget(),
        data: preparedTx.encode(),
      });
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(5);
    });

    it("can execute a batched raw tx", {
      timeout: 120_000,
    }, async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.executeBatchRaw([
        {
          to: preparedTx.getTarget(),
          data: preparedTx.encode(),
        },
        {
          to: preparedTx.getTarget(),
          data: preparedTx.encode(),
        },
      ]);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(7);
    });

    it("can sign and verify 1271 old factory", {
      timeout: 240_000,
    }, async () => {
      const message = "0x1234";
      const sig = await smartWallet.signMessage(message);
      const isValidV1 = await smartWallet.verifySignature(
        message,
        sig,
        smartWalletAddress,
        chain.chainId,
      );
      expect(isValidV1).toEqual(true);
      const isValidV2 = await checkContractWalletSignature(
        message,
        sig,
        smartWalletAddress,
        chain.chainId,
        undefined,
        SECRET_KEY,
      );
      expect(isValidV2).toEqual(true);
    });

    it("can sign and verify 1271 new factory", {
      timeout: 240_000,
    }, async () => {
      smartWallet = new SmartWallet({
        chain,
        factoryAddress: factoryAddressV2,
        gasless: true,
        secretKey: process.env.TW_SECRET_KEY,
      });
      smartWalletAddress = await smartWallet.connect({ personalWallet });
      const message = "0x1234";
      const sig = await smartWallet.signMessage(message);
      const isValidV1 = await smartWallet.verifySignature(
        message,
        sig,
        smartWalletAddress,
        chain.chainId,
      );
      expect(isValidV1).toEqual(true);
      const isValidV2 = await checkContractWalletSignature(
        message,
        sig,
        smartWalletAddress,
        chain.chainId,
        undefined,
        SECRET_KEY,
      );
      expect(isValidV2).toEqual(true);
    });
  },
);
