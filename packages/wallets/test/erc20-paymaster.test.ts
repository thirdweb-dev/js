/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { SmartWallet } from "../src/evm/wallets/smart-wallet";
import { LocalWallet } from "../src/evm/wallets/local-wallet";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";
import { BigNumber, ethers } from "ethers";

require("dotenv-mono").load();
jest.setTimeout(240_000);

let smartWallet: SmartWallet;
let smartWalletAddress: string;
let personalWallet: LocalWallet;
let contract: SmartContract;
let sdk: ThirdwebSDK;
const factoryAddress = "0x0Ef392D2CCe0f1cb2ed1309BCae11A0d6c59f872";
const chain = BaseSepoliaTestnet;
const erc20PaymasterAddress = "0xFA854D9C6f279bA798C67BD22ffAEcf090B5a87c"; // SimpleERC20Paymaster
const erc20TokenAddress = "0xF7235993A1BB401620e7c384D541e78D18081090"; // Base DIA

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
    erc20PaymasterAddress: erc20PaymasterAddress,
    erc20TokenAddress: erc20TokenAddress,
  });
  smartWalletAddress = await smartWallet.connect({ personalWallet });
  sdk = await ThirdwebSDK.fromWallet(smartWallet, chain);
  contract = await sdk.getContract(
    "0xF7235993A1BB401620e7c384D541e78D18081090", // using same token for payment and claim
  );
});

describeIf(!!process.env.TW_SECRET_KEY)("ERC20Paymaster core tests", () => {
  it("can connect", async () => {
    expect(smartWalletAddress).toHaveLength(42);
  });

  it("should deploy+approve (gasless) and execute a tx", async () => {
    const tokenContract = await sdk.getContract(erc20TokenAddress);

    // initial checks
    let approvedAmount = (
      await tokenContract.erc20.allowanceOf(
        smartWalletAddress,
        erc20PaymasterAddress,
      )
    ).value;
    expect(approvedAmount.toNumber()).toEqual(0);

    let isDeployed = await smartWallet.isDeployed();
    expect(isDeployed).toEqual(false);

    let balance = (await contract.erc20.balance()).value;
    expect(balance.toNumber()).toEqual(0);

    // airdrop tokens for payment
    const tempLocalWallet = new LocalWallet();
    await tempLocalWallet.generate();
    const tempSmartWallet = new SmartWallet({
      chain,
      factoryAddress,
      gasless: true,
      secretKey: process.env.TW_SECRET_KEY,
    });
    await tempSmartWallet.connect({
      personalWallet: tempLocalWallet,
    });
    const claimTx = await contract.erc20.claimTo.prepare(smartWalletAddress, 1); // tx costs 1
    const claimReceipt = await tempSmartWallet.execute(claimTx);
    expect(claimReceipt.receipt.transactionHash).toHaveLength(66);
    balance = (await contract.erc20.balance()).value;
    expect(balance).toEqual(ethers.utils.parseEther("1"));

    // transact with newly funded smart wallet using erc20 exclusively
    const preparedTx = await contract.erc20.claim.prepare(1);
    const tx = await smartWallet.execute(preparedTx);
    expect(tx.receipt.transactionHash).toHaveLength(66);

    approvedAmount = (
      await tokenContract.erc20.allowanceOf(
        smartWalletAddress,
        erc20PaymasterAddress,
      )
    ).value;
    expect(approvedAmount).toEqual(
      BigNumber.from(2).pow(96).sub(1).sub(ethers.utils.parseEther("1")), // 2^96 - 1 - 1^18 <- 1^18 is the tx cost removed from allowance
    );

    isDeployed = await smartWallet.isDeployed();
    expect(isDeployed).toEqual(true);

    balance = (await contract.erc20.balance()).value;
    expect(balance).toEqual(ethers.utils.parseEther("1")); // we spent 1 token to claim 1 token
  });
});
