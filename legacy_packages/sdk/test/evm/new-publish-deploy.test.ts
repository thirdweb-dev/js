import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  extendedMetadataMock,
  jsonProvider,
  sdk,
  signers,
  thirdwebFactory,
} from "./before-setup";
import { expect, assert } from "chai";
import {
  Forwarder__factory,
  DropERC721__factory,
  ERC721Base__factory,
} from "@thirdweb-dev/contracts-js";
import {
  bytecode as SplitMainBytecode,
  deployedBytecode as SplitMainDeployedBytecode,
  abi as SplitMainAbi,
} from "./metadata/SplitMain";
import {
  bytecode as SplitWalletBytecode,
  deployedBytecode as SplitWalletDeployedBytecode,
  abi as SplitWalletAbi,
} from "./metadata/SplitWallet";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";
import { mockUploadMetadataWithBytecode } from "./utils";

describe("New Publish Flow", async () => {
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w4: SignerWithAddress;

  beforeEach(async () => {
    await jsonProvider.send("hardhat_reset", []);
    [adminWallet, samWallet, bobWallet, , , , , w4] = signers;
  });
  before("Mock upload infra contracts", async () => {
    // mock upload Forwarder
    await mockUploadMetadataWithBytecode(
      "Forwarder",
      Forwarder__factory.abi,
      Forwarder__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
      },
      "ipfs://Qmcu8FaqerUvQYb4qPg7PwkXa6dRtEe45LedLJPN42Jwqe/0",
      // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
    );

    // mock upload TWCloneFactory
    await mockUploadMetadataWithBytecode(
      "Forwarder",
      TWCloneFactoryAbi,
      TWCloneFactoryBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
      },
      "ipfs://QmYfw13Zykqf9jAmJobNgYrEpatEF9waWcQPUHvJ7sctRb/0",
      // ^ we use actual publish uri as mock uri here, because this contract's uri is fetched from publisher by contractName
    );
  });

  describe("Deploy newly published contract", async () => {
    it("should deploy regular contract", async () => {
      // mock publish as a standard-deploy contract
      const mockPublishUri = await mockUploadMetadataWithBytecode(
        "ERC721Base",
        ERC721Base__factory.abi,
        ERC721Base__factory.bytecode,
        "",
        {
          ...extendedMetadataMock,
          deployType: "standard",
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          publisher: await adminWallet.getAddress(),
        },
      );

      // deploy with mock uri
      const admin = await adminWallet.getAddress();
      const contractAddress = await sdk.deployer.deployContractFromUri(
        mockPublishUri,
        [admin, "Direct Deploy ERC721Base", "DDE", admin, 5],
      );
      const contract = await sdk.getContract(contractAddress);

      const name = await contract.call("name");
      const owner = await contract.call("owner");

      expect(name).to.equal("Direct Deploy ERC721Base");
      expect(owner).to.equal(admin);
    });

    it("should deploy with custom factory", async () => {
      // mock publish SplitMain as a standard-deploy contract
      const splitMainMockUri = await mockUploadMetadataWithBytecode(
        "SplitMain",
        SplitMainAbi,
        SplitMainBytecode,
        SplitMainDeployedBytecode,
        {
          ...extendedMetadataMock,
          deployType: "standard",
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          publisher: await adminWallet.getAddress(),
        },
      );

      // deploy custom-factory `SplitMain`, with mock uri
      const splitMainAddress = await sdk.deployer.deployContractFromUri(
        splitMainMockUri,
        [],
      );

      // mock publish SplitWallet as a custom-factory-deploy contract
      const splitWalletMockUri = await mockUploadMetadataWithBytecode(
        "SplitWallet",
        SplitWalletAbi,
        SplitWalletBytecode,
        SplitWalletDeployedBytecode,
        {
          ...extendedMetadataMock,
          deployType: "customFactory",
          factoryDeploymentData: {
            ...extendedMetadataMock.factoryDeploymentData,
            customFactoryInput: {
              factoryFunction: "createSplit",
              params: [],
              customFactoryAddresses: {
                "31337": splitMainAddress,
              },
            },
          },
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          publisher: await adminWallet.getAddress(),
        },
      );

      // deploy contract via custom-factory, with mock uri
      const splitWalletAddress = await sdk.deployer.deployContractFromUri(
        splitWalletMockUri,
        [
          [await bobWallet.getAddress(), await adminWallet.getAddress()],
          [500000, 500000],
          0,
          await adminWallet.getAddress(),
        ],
      );

      const splitContract = await sdk.getContract(splitWalletAddress);
      const deployingAddress = await splitContract.call("splitMain");

      expect(deployingAddress).to.equal(splitMainAddress);
    });
  });

  describe("Deploy re-published contract", async () => {
    it("should deploy with auto factory", async () => {
      const mockPublisher = process.env.contractPublisherAddress;
      process.env.contractPublisherAddress =
        "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
      const adminAddress = await adminWallet.getAddress();

      // mock publish as a autoFactory-deploy contract
      const mockPublishUri = await mockUploadMetadataWithBytecode(
        "DropERC721",
        DropERC721__factory.abi,
        DropERC721__factory.bytecode,
        "",
        {
          ...extendedMetadataMock,
          deployType: "autoFactory",
          networksForDeployment: {
            allNetworks: true,
            networksEnabled: [],
          },
          publisher: adminAddress,
        },
      );

      // deploy via autoFactory, with mock uri
      const contractAddress = await sdk.deployer.deployContractFromUri(
        mockPublishUri,
        [
          adminAddress,
          "DropERC721 Minimal Proxy",
          "DME",
          "",
          [],
          adminAddress,
          adminAddress,
          5,
          5,
          adminAddress,
        ],
      );
      const contract = await sdk.getContract(contractAddress);

      const name = await contract.call("name");
      const owner = await contract.call("owner");
      const code = await sdk.getProvider().getCode(contractAddress);

      expect(name).to.equal("DropERC721 Minimal Proxy");
      expect(owner).to.equal(adminAddress);
      assert(code.startsWith("0x363d3d373d3d3d363d73"));

      process.env.contractPublisherAddress = mockPublisher;
    });
  });

  describe("Deploy old contract without re-publishing", async () => {
    it("should deploy regular contract", async () => {
      // mock publish as old style -- omit deployType, networksForDeployment etc
      const mockPublishUri = await mockUploadMetadataWithBytecode(
        "ERC721Base",
        ERC721Base__factory.abi,
        ERC721Base__factory.bytecode,
        "",
        extendedMetadataMock,
      );

      // deploy with mock uri
      const admin = await adminWallet.getAddress();
      const contractAddress = await sdk.deployer.deployContractFromUri(
        mockPublishUri,
        [admin, "Direct Deploy ERC721Base", "DDE", admin, 5],
      );
      const contract = await sdk.getContract(contractAddress);

      const name = await contract.call("name");
      const owner = await contract.call("owner");

      expect(name).to.equal("Direct Deploy ERC721Base");
      expect(owner).to.equal(admin);
    });

    it("should deploy via old factory", async () => {
      const mockPublisher = process.env.contractPublisherAddress;
      process.env.contractPublisherAddress =
        "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
      const adminAddress = await adminWallet.getAddress();

      // mock publish as old-style factory deployable -- omit deployType, networksForDeployment etc
      const mockPublishUri = await mockUploadMetadataWithBytecode(
        "DropERC721",
        DropERC721__factory.abi,
        DropERC721__factory.bytecode,
        "",
        {
          ...extendedMetadataMock,
          isDeployableViaFactory: true,
          publisher: adminAddress,
        },
      );

      // deploy implementation
      const implementationAddress = await sdk.deployer.deployContractFromUri(
        mockPublishUri,
        [],
        {
          forceDirectDeploy: true,
        },
      );
      await (
        await thirdwebFactory.addImplementation(implementationAddress)
      ).wait();

      // re-upload, with implementation address
      const mockPublishUriUpdated = await mockUploadMetadataWithBytecode(
        "DropERC721",
        DropERC721__factory.abi,
        DropERC721__factory.bytecode,
        "",
        {
          ...extendedMetadataMock,
          isDeployableViaFactory: true,
          factoryDeploymentData: {
            ...extendedMetadataMock?.factoryDeploymentData,
            implementationAddresses: {
              "31337": implementationAddress,
            },
            factoryAddresses: {
              "31337": process.env.factoryAddress,
            },
          },
          publisher: adminAddress,
        },
      );

      // Deploy proxy DropERC721
      const contractAddress = await sdk.deployer.deployContractFromUri(
        mockPublishUriUpdated,
        [
          adminAddress,
          "Drop Proxy Old",
          "DPA",
          "",
          [],
          adminAddress,
          adminAddress,
          5,
          5,
          adminAddress,
        ],
      );

      const drop = await sdk.getContract(contractAddress);
      const bytecode = await sdk.getProvider().getCode(contractAddress);
      const name = await drop.call("name");

      expect(name).to.equal("Drop Proxy Old");
      assert(bytecode.startsWith("0x363d3d373d3d3d363d73"));
    });
  });

  // TODO: test any-evm vs standard chain deploys with same publish-uri
});
