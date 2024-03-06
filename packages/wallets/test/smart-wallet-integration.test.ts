/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import { Mumbai } from "@thirdweb-dev/chains";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";
import { checkContractWalletSignature } from "../src/evm/wallets/abstract";

require("dotenv-mono").load();
jest.setTimeout(240_000);

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let contract: SmartContract;
const factoryAddress = "0x13947435c2fe6BE51ED82F6f59C38617a323dB9B"; // pre 712
const factoryAddressV2 = "0xC64d04AedecA895b3F20DC6866b4b532e0b22634"; // post 712
const chain = Mumbai;

const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

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

describeIf(!!process.env.TW_SECRET_KEY)("SmartWallet core tests", () => {
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
    );
    expect(isValidV2).toEqual(true);
  });
});
