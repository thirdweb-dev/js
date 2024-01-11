/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import hardhat from "hardhat";
import { ChainInfo, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { EthersWallet } from "../src/evm/wallets/ethers";
import { EntryPoint__factory } from "@account-abstraction/contracts";
import { AbstractWallet } from "../src";

// TODO make this work with a mock bundler/paymaster

const hardhatEthers = (hardhat as any).ethers;

let personalWallet: AbstractWallet;
let factoryAddress: string;
const chain: ChainInfo = {
  chainId: 31337,
  rpc: ["http://localhost:8545"],
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  slug: "hardhat",
};

beforeAll(async () => {
  await hardhatEthers.provider.send("hardhat_reset", []);
  const [owner] = await hardhatEthers.getSigners();
  console.log("owner", owner.address);
  personalWallet = new EthersWallet(owner);
  // deploy entrypoint and account factory
  const sdk = ThirdwebSDK.fromSigner(owner);
  const entrypointAddress = await sdk.deployer.deployContractWithAbi(
    EntryPoint__factory.abi,
    EntryPoint__factory.bytecode,
    [],
  );
  console.log("entryPoint", entrypointAddress);
  const factory = await sdk.deployer.deployPublishedContract(
    "deployer.thirdweb.eth",
    "AccountFactory",
    [owner.address, entrypointAddress],
  );
  console.log("factory", factory);
  factoryAddress = factory;
});

describe("SmartWallet", () => {
  it("can connect", async () => {
    const sw = new SmartWallet({
      chain,
      factoryAddress,
      gasless: false,
    });
    const addr = await sw.connect({ personalWallet });
    console.log("addr", addr);
    // TODO mock bundler / paymaster
  });
});
