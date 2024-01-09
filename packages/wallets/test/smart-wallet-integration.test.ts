/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import { Mumbai } from "@thirdweb-dev/chains";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let contract: SmartContract;
const factoryAddress = "0x13947435c2fe6BE51ED82F6f59C38617a323dB9B";
const chain = Mumbai;

beforeAll(async () => {
  personalWallet = new LocalWallet();
  await personalWallet.generate();
  smartWallet = new SmartWallet({
    chain,
    factoryAddress,
    gasless: true,
    secretKey: process.env.TW_SECRET_KEY,
  });
  smartWalletAddress = await smartWallet.connect({ personalWallet });
  const sdk = await ThirdwebSDK.fromWallet(smartWallet, chain);
  contract = await sdk.getContract(
    "0xD170A53dADb19f62C78AB9982236857B71dbc83A", // mumbai edition drop
  );
});

describe("SmartWallet core tests", () => {
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
    expect(estimates.wei.toNumber()).toBeGreaterThan(0);
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
});
