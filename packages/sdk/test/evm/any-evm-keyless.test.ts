import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from "../../src/evm";
import { SmartContract } from "../../src/evm/contracts/smart-contract";
import { signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "ethers";

describe("Any EVM Keyless Deploy", async () => {
  let contract: SmartContract;
  let sdk: ThirdwebSDK;
  let adminWallet: SignerWithAddress;
  let claimerWallet: SignerWithAddress;
  let notificationCounter: number;
  let transactionCount: number;

  async function deployTieredDrop() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const walletAddress = await sdk.wallet.getAddress();

    // This needs to match the published contract for the currently used ABI
    const publishUri =
      "ipfs://QmXu9ezFNgXBX1juLZ7kwdf5KpTD1x9GPHnk14QB2NpUvK/0";
    console.log(
      "transactions: ",
      await sdk.deployer.getTransactionsForDeploy(publishUri),
    );
    transactionCount = (await sdk.deployer.getTransactionsForDeploy(publishUri))
      .length;

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        walletAddress, // defaultAdmin
        "Tiered Drop #1", // name
        "TD", // symbol
        "ipfs://QmUj5kNz7Xe5AEhV2YvHiCKfMSL5YZpD4E18QLLYEsGBcd/0", // contractUri
        [], // trustedForwarders
        walletAddress, // saleRecipient
        walletAddress, // royaltyRecipient
        0, // royaltyBps
      ],
      {
        forceDirectDeploy: false,
        notifier(status, contractType) {
          notificationCounter += 1;
        },
      },
    );

    process.env.contractPublisherAddress = mockPublisher;
    const tieredDrop = await sdk.getContract(address);

    return tieredDrop;
  }

  async function deployMarketplaceV3() {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const walletAddress = await sdk.wallet.getAddress();

    // This needs to match the published contract for the currently used ABI
    const publishUri = "ipfs://QmP2QPzc81zg5rqhU9u7cDeSyD4aZH8RdVF8Nuh6rCCgxV";
    // console.log(
    //   "transactions: ",
    //   await sdk.deployer.getTransactionsForDeploy(publishUri),
    // );
    // transactionCount = (await sdk.deployer.getTransactionsForDeploy(publishUri))
    //   .length;

    const address = await sdk.deployer.deployContractFromUri(
      publishUri,
      [
        walletAddress, // defaultAdmin
        "ipfs://QmP2QPzc81zg5rqhU9u7cDeSyD4aZH8RdVF8Nuh6rCCgxV", // contractUri
        [], // trustedForwarders
        walletAddress, // platform fee recipient
        0, // platform fee bps
      ],
      {
        forceDirectDeploy: false,
        // notifier(status, contractType) {
        //   notificationCounter += 1;
        // },
      },
    );

    process.env.contractPublisherAddress = mockPublisher;
    const marketplace = await sdk.getContract(address);

    return marketplace;
  }

  before(async () => {
    [adminWallet, claimerWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet);
  });

  beforeEach(() => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  // it("correct count of logs and transactions", async () => {
  // notificationCounter = 0;
  // transactionCount = 0;
  // contract = await deployTieredDrop();
  // expect(notificationCounter).to.equal(8);
  // expect(transactionCount).to.equal(4);

  // notificationCounter = 0;
  // transactionCount = 0;
  // contract = await deployTieredDrop();
  // expect(notificationCounter).to.equal(2);
  // expect(transactionCount).to.equal(1);
  // });

  it("deploy marketplacev3", async () => {
    notificationCounter = 0;
    transactionCount = 0;
    const marketplace = await deployMarketplaceV3();
    expect(notificationCounter).to.equal(2 * transactionCount);

    let plugins = await marketplace.call("getAllPlugins");
    // console.log("plugins: ", plugins);
    // console.log("plugins ^");

    let allPlugins = plugins.map((item: any) => item.pluginAddress);
    let pluginsAddresses = Array.from(new Set(allPlugins));

    expect(pluginsAddresses.length).to.equal(3);

    pluginsAddresses.forEach(async (address) => {
      expect(address).to.not.equal(ethers.constants.AddressZero);

      const code = await adminWallet.provider?.getCode(address as string);

      // console.log("code length: ", code?.length);
      expect(code?.length).to.be.greaterThan(2);
    });

    // deploy again
    notificationCounter = 0;
    transactionCount = 0;
    const marketplace2 = await deployMarketplaceV3();
    expect(notificationCounter).to.equal(2 * transactionCount);
    plugins = await marketplace2.call("getAllPlugins");
    console.log("plugins: ", plugins);
    console.log("plugins ^");

    allPlugins = plugins.map((item: any) => item.pluginAddress);
    pluginsAddresses = Array.from(new Set(allPlugins));

    expect(pluginsAddresses.length).to.equal(3);

    pluginsAddresses.forEach(async (address) => {
      expect(address).to.not.equal(ethers.constants.AddressZero);

      const code = await adminWallet.provider?.getCode(address as string);

      console.log("code length: ", code?.length);
      expect(code?.length).to.be.greaterThan(2);
    });
  });
});
