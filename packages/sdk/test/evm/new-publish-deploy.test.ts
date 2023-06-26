import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { fastForwardTime, jsonProvider, sdk, signers } from "./before-setup";
import { expect, assert } from "chai";
import { ThirdwebSDK } from "../../src/evm";
import { BigNumber } from "ethers";

describe("New Publish Flow", async () => {
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w4: SignerWithAddress;

  let realSDK: ThirdwebSDK;

  before("", async () => {});

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, , , , , w4] = signers;
    realSDK = new ThirdwebSDK(adminWallet);
  });

  describe("Deploy newly published contract", async () => {
    let publishUriWithDirectDeploy: string;
    let publishUriWithCustomFactoryDeploy: string;
    let customFactoryPublishUri: string;
    let publishUriWithAutoFactoryDeploy: string;

    before("", async () => {
      // https://thirdweb.com/thirdweb.eth/MyContract - v1.0.1
      publishUriWithDirectDeploy =
        "ipfs://QmUCEvfDQxEmWNLrcun8ZV8pUU4x9oxkFavJjC133tJFVN/";

      // Split Wallet
      publishUriWithCustomFactoryDeploy =
        "ipfs://Qmc5cQotuEnCo71ZztJk69wc8kuKbGmuCARL2FyAojoi9r/";

      // Split Main
      customFactoryPublishUri =
        "ipfs://QmZZUsE2hQbKc4pHPC3qjfXYrMvg8mceDqHxoQhgMudwau/";

      publishUriWithAutoFactoryDeploy = "";
    });
    it("should deploy regular contract", async () => {
      const input = 27;
      const contractAddress = await realSDK.deployer.deployContractFromUri(
        publishUriWithDirectDeploy,
        [input],
      );
      const contract = await realSDK.getContract(contractAddress);

      const number: BigNumber = await contract.call("number");
      const deployer: string = await contract.call("deployer");

      expect(number.toNumber()).to.equal(input);
      expect(deployer).to.equal(adminWallet.address);
    });

    it("should deploy with custom factory", async () => {});

    it("should deploy with auto factory", async () => {});
  });

  describe("Deploy re-published contract", async () => {});

  describe("Deploy old contract without re-publishing", async () => {
    let publishUriWithDirectDeploy: string;
    let publishUriWithFactoryDeploy: string;
    let publishUriWithProxyDeploy: string;

    before("", async () => {
      // https://thirdweb.com/thirdweb.eth/MyContract - v1.0.0
      publishUriWithDirectDeploy =
        "ipfs://QmXMzTh8HhAW1eVkdYHS26siEpK5TUfDxYQHkJ3gdPFHpr";

      // https://thirdweb.com/thirdweb.eth/DropERC721 - v4.0.7
      publishUriWithFactoryDeploy =
        "ipfs://QmPASFEYVvUfXfztAHXNTcCqaJQcyr4RcLcW5F6BZsZvjg";
      publishUriWithProxyDeploy = "";
    });
  });

  // TODO: test any-evm vs standard chain deploys with same publish-uri
  // TODO: test enabled/disabled networks with new publish
});
