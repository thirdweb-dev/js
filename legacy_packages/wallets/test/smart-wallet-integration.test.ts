/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import { ArbitrumSepolia } from "@thirdweb-dev/chains";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";
import { checkContractWalletSignature } from "../src/evm/connectors/smart-wallet/lib/check-contract-wallet-signature";
import { describe, it, expect, beforeAll } from "vitest";

require("dotenv-mono").load();

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let contract: SmartContract;
const factoryAddress = "0x564cf6453a1b0FF8DB603E92EA4BbD410dea45F3"; // pre 712
const factoryAddressV2 = "0xbf1C9aA4B1A085f7DA890a44E82B0A1289A40052"; // post 712
const chain = ArbitrumSepolia;
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
    "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3", // arb sep edition drop
  );
});

describeIf(!!SECRET_KEY)(
  "SmartWallet core tests",
  {
    timeout: 240_000,
  },
  () => {
    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
    });

    it("can execute a tx via SDK", async () => {
      const tx = await contract.erc1155.claim(0, 1);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const isDeployed = await smartWallet.isDeployed();
      expect(isDeployed).toEqual(true);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(1);
    });

    it("can estimate a tx", async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const estimates = await smartWallet.estimate(preparedTx);
      expect(estimates.wei.toString()).not.toBe("0");
    });

    it("can execute a tx", async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.execute(preparedTx);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(2);
    });

    it("can execute a batched tx", async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.executeBatch([preparedTx, preparedTx]);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(4);
    });

    it("can execute a raw tx", async () => {
      const preparedTx = await contract.erc1155.claim.prepare(0, 1);
      const tx = await smartWallet.executeRaw({
        to: preparedTx.getTarget(),
        data: preparedTx.encode(),
      });
      expect(tx.receipt.transactionHash).toHaveLength(66);
      const balance = await contract.erc1155.balance(0);
      expect(balance.toNumber()).toEqual(5);
    });

    it("can execute a batched raw tx", async () => {
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

    it("can sign and verify 1271 old factory", async () => {
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

    it("can sign and verify 1271 new factory", async () => {
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
