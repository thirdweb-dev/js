import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { jsonProvider, sdk, signers, thirdwebFactory } from "./before-setup";
import { expect, assert } from "chai";
import { ThirdwebSDK, fetchAndCacheDeployMetadata } from "../../src/evm";
import { BigNumber } from "ethers";
import { mockUploadWithCID } from "./mock/MockStorage";

describe("New Publish Flow", async () => {
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w4: SignerWithAddress;

  let realSDK: ThirdwebSDK;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, , , , , w4] = signers;
    realSDK = new ThirdwebSDK(adminWallet, {
      gatewayUrls: ["https://gateway.ipfscdn.io/ipfs/"],
    });
  });

  describe("Deploy newly published contract", async () => {
    let publishUriWithDirectDeploy: string;
    let publishUriWithCustomFactoryDeploy: string;
    let customFactoryPublishUri: string;

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

    it("should deploy with custom factory", async () => {
      // Re-upload with mock storage, enable all networks
      const { compilerMetadata, extendedMetadata } =
        await fetchAndCacheDeployMetadata(
          customFactoryPublishUri,
          realSDK.storage,
        );
      await mockUploadWithCID(
        compilerMetadata.metadataUri.replace("ipfs://", ""),
        JSON.stringify(compilerMetadata.metadata),
      );
      await mockUploadWithCID("bytecode1", compilerMetadata.bytecode);
      await mockUploadWithCID(
        "cid1",
        JSON.stringify({
          ...extendedMetadata,
          metadataUri: compilerMetadata.metadataUri,
          bytecodeUri: "bytecode1",
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          version: "1.0.2",
        }),
      );

      // deploy custom-factory `SplitMain`
      const customFactoryAddress = await sdk.deployer.deployContractFromUri(
        "cid1",
        [],
      );

      // Re-upload contract metadata with mock storage
      // set custom-factory address on hardhat chain
      const contractMetadata = await fetchAndCacheDeployMetadata(
        publishUriWithCustomFactoryDeploy,
        realSDK.storage,
      );
      await mockUploadWithCID(
        contractMetadata.compilerMetadata.metadataUri.replace("ipfs://", ""),
        JSON.stringify(contractMetadata.compilerMetadata.metadata),
      );
      await mockUploadWithCID(
        "bytecode2",
        contractMetadata.compilerMetadata.bytecode,
      );
      await mockUploadWithCID(
        "cid2",
        JSON.stringify({
          ...contractMetadata.extendedMetadata,
          metadataUri: contractMetadata.compilerMetadata.metadataUri,
          bytecodeUri: "bytecode2",
          factoryDeploymentData: {
            ...contractMetadata.extendedMetadata?.factoryDeploymentData,
            implementationAddresses: {},
            customFactoryInput: {
              factoryFunction: "createSplit",
              params: [],
              customFactoryAddresses: {
                "31337": customFactoryAddress,
              },
            },
          },
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          version: "1.0.3",
        }),
      );

      // deploy contract via custom-factory
      const contractAddress = await sdk.deployer.deployContractFromUri("cid2", [
        [await bobWallet.getAddress(), await adminWallet.getAddress()],
        [500000, 500000],
        0,
        await adminWallet.getAddress(),
      ]);

      const splitContract = await sdk.getContract(contractAddress);
      const deployingAddress = await splitContract.call("splitMain");

      expect(deployingAddress).to.equal(customFactoryAddress);
    });
  });

  describe("Deploy re-published contract", async () => {
    let publishUriWithAutoFactoryDeploy: string;

    before("", async () => {
      // Multiwrap
      publishUriWithAutoFactoryDeploy =
        "ipfs://QmQBgncSxFwLKusgAzXVpaWTuJTfV5yL6vs3jYXzz89EaY/";
    });

    it("should deploy with auto factory", async () => {
      const mockPublisher = process.env.contractPublisherAddress;
      process.env.contractPublisherAddress =
        "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
      // deploy contract via auto-factory
      const adminAddress = await adminWallet.getAddress();
      const contractAddress = await realSDK.deployer.deployContractFromUri(
        publishUriWithAutoFactoryDeploy,
        [adminAddress, "Multiwrap Auto", "MA", "", [], adminAddress, 5],
      );

      const multiwrap = await realSDK.getContract(contractAddress);
      const bytecode = await realSDK.getProvider().getCode(contractAddress);
      const name = await multiwrap.call("name");

      expect(name).to.equal("Multiwrap Auto");
      assert(bytecode.startsWith("0x363d3d373d3d3d363d73"));

      process.env.contractPublisherAddress = mockPublisher;
    });
  });

  describe("Deploy old contract without re-publishing", async () => {
    let publishUriWithDirectDeploy: string;
    let publishUriWithFactoryDeploy: string;

    before("", async () => {
      // https://thirdweb.com/thirdweb.eth/MyContract - v1.0.0
      publishUriWithDirectDeploy =
        "ipfs://QmXMzTh8HhAW1eVkdYHS26siEpK5TUfDxYQHkJ3gdPFHpr";

      // https://thirdweb.com/thirdweb.eth/DropERC721 - v4.0.7
      publishUriWithFactoryDeploy =
        "ipfs://QmPASFEYVvUfXfztAHXNTcCqaJQcyr4RcLcW5F6BZsZvjg";
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

    it("should deploy via old factory", async () => {
      // deploy implementation
      const implementationAddress =
        await realSDK.deployer.deployContractFromUri(
          publishUriWithFactoryDeploy,
          [],
          { forceDirectDeploy: true },
        );
      await (
        await thirdwebFactory.addImplementation(implementationAddress)
      ).wait();

      // Re-upload with mock storage, set implementation address for hardhat network
      const { compilerMetadata, extendedMetadata } =
        await fetchAndCacheDeployMetadata(
          publishUriWithFactoryDeploy,
          realSDK.storage,
        );
      await mockUploadWithCID(
        compilerMetadata.metadataUri.replace("ipfs://", ""),
        JSON.stringify(compilerMetadata.metadata),
      );
      await mockUploadWithCID("bytecode4", compilerMetadata.bytecode);
      await mockUploadWithCID(
        "cid4",
        JSON.stringify({
          ...extendedMetadata,
          metadataUri: compilerMetadata.metadataUri,
          bytecodeUri: "bytecode4",
          factoryDeploymentData: {
            ...extendedMetadata?.factoryDeploymentData,
            implementationAddresses: {
              "31337": implementationAddress,
            },
            factoryAddresses: {
              "31337": process.env.factoryAddress,
            },
          },
          version: "1.0.2",
        }),
      );

      const adminAddress = await adminWallet.getAddress();
      //note: here using sdk (with mock storage), instead of realSDK
      const contractAddress = await sdk.deployer.deployContractFromUri("cid4", [
        adminAddress,
        "Drop Auto",
        "DA",
        "",
        [],
        adminAddress,
        adminAddress,
        5,
        5,
        adminAddress,
      ]);

      const drop = await sdk.getContract(contractAddress);
      const bytecode = await sdk.getProvider().getCode(contractAddress);
      const name = await drop.call("name");

      expect(name).to.equal("Drop Auto");
      assert(bytecode.startsWith("0x363d3d373d3d3d363d73"));
    });
  });

  // TODO: test any-evm vs standard chain deploys with same publish-uri
});
