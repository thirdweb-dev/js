/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import {
  ZkcandySepoliaTestnet,
  ZksyncSepoliaTestnet,
} from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { describe, it, expect, beforeAll } from "vitest";

require("dotenv-mono").load();

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let sdk: ThirdwebSDK;
const chain = ZksyncSepoliaTestnet;
const SECRET_KEY = process.env.TW_SECRET_KEY;

const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

beforeAll(async () => {
  personalWallet = new LocalWallet({
    chain,
    secretKey: SECRET_KEY,
  });
  await personalWallet.generate();
  await personalWallet.connect();
  smartWallet = new SmartWallet({
    chain,
    gasless: true,
    secretKey: SECRET_KEY,
  });
  smartWalletAddress = await smartWallet.connect({ personalWallet });
  sdk = await ThirdwebSDK.fromWallet(smartWallet, chain, {
    secretKey: SECRET_KEY,
  });
});

describeIf(!!SECRET_KEY)("SmartWallet core tests", () => {
  it("can connect", async () => {
    expect(smartWalletAddress).toHaveLength(42);
  });

  it(
    "can execute zk sepolia tx via SDK",
    {
      timeout: 120_000,
    },
    async () => {
      const tx = await sdk.wallet.transfer(smartWalletAddress, 0);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      console.log(tx.receipt.transactionHash);
      // useless check but I overrode it anyway jic
      const isDeployed = await smartWallet.isDeployed();
      expect(isDeployed).toEqual(true);
    },
  );

  it(
    "can interact with contract",
    {
      timeout: 120_000,
    },
    async () => {
      const contract = await sdk.getContract(
        "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77",
      );
      const approveTx = await contract.erc1155.setApprovalForAll(
        "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77",
        false,
      );
      console.log(approveTx.receipt.transactionHash);
      expect(approveTx.receipt.transactionHash).toHaveLength(66);
    },
  );

  it.skip(
    "can execute zkcandy tx via SDK",
    {
      timeout: 120_000,
    },
    async () => {
      const zkCandysmartWallet = new SmartWallet({
        chain: 302,
        gasless: true,
        secretKey: SECRET_KEY,
      });
      const zkCandyPersonalWallet = new LocalWallet({
        chain: ZkcandySepoliaTestnet,
        secretKey: SECRET_KEY,
      });
      await zkCandyPersonalWallet.generate();
      await zkCandyPersonalWallet.connect();
      const zkCandyWalletAddress = await zkCandysmartWallet.connect({
        personalWallet: zkCandyPersonalWallet,
      });
      const zkCandySdk = await ThirdwebSDK.fromWallet(zkCandysmartWallet, 302, {
        secretKey: SECRET_KEY,
      });
      const tx = await zkCandySdk.wallet.transfer(zkCandyWalletAddress, 0);
      expect(tx.receipt.transactionHash).toHaveLength(66);
      console.log(tx.receipt.transactionHash);
    },
  );
});
