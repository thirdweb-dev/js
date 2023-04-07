import { NATIVE_TOKEN_ADDRESS, ThirdwebSDK } from "../../src/evm";
import { SmartContract } from "../../src/evm/contracts/smart-contract";
import { signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";

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

  before(async () => {
    [adminWallet, claimerWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet);
  });

  beforeEach(() => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("correct count of logs and transactions", async () => {
    notificationCounter = 0;
    transactionCount = 0;
    contract = await deployTieredDrop();
    expect(notificationCounter).to.equal(8);
    expect(transactionCount).to.equal(4);

    notificationCounter = 0;
    transactionCount = 0;
    contract = await deployTieredDrop();
    expect(notificationCounter).to.equal(2);
    expect(transactionCount).to.equal(1);
  });
});
