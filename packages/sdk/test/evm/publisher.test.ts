import {
  ChainId,
  isFeatureEnabled,
  resolveContractUriFromAddress,
  ThirdwebSDK,
} from "../../src/evm";
import { implementations, signers } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DropERC721__factory,
  TokenERC721__factory,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { expect } from "chai";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import invariant from "tiny-invariant";

global.fetch = require("cross-fetch");

export const uploadContractMetadata = async (
  contractName: string,
  storage: ThirdwebStorage,
) => {
  const buildinfo = JSON.parse(
    readFileSync("test/test_abis/hardhat-build-info.json", "utf-8"),
  );
  const info =
    buildinfo.output.contracts[`contracts/${contractName}.sol`][contractName];
  const bytecode = `0x${info.evm.bytecode.object}`;
  const metadataUri = await storage.upload(info.metadata, {
    uploadWithoutDirectory: true,
  });
  const bytecodeUri = await storage.upload(bytecode, {
    uploadWithoutDirectory: true,
  });
  const model = {
    name: contractName,
    metadataUri: `ipfs://${metadataUri}`,
    bytecodeUri: `ipfs://${bytecodeUri}`,
  };
  return await storage.upload(model);
};

describe("Publishing", async () => {
  let simpleContractUri: string;
  let contructorParamsContractUri: string;
  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;
  let bobWallet: SignerWithAddress;
  let sdk: ThirdwebSDK;

  before("Upload abis", async () => {
    [adminWallet, samWallet, bobWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet);
    simpleContractUri =
      "ipfs://QmNPcYsXDAZvQZXCG73WSjdiwffZkNkoJYwrDDtcgM142A/0";
    // if we change the test data - await uploadContractMetadata("Greeter", storage);
    contructorParamsContractUri =
      "ipfs://QmT5Dx3xigHr6BPG8scxbX7JaAucHRD9UPXc6FCtgcNn5e/0";
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("should extract functions", async () => {
    const publisher = sdk.getPublisher();
    const functions = await publisher.extractFunctions(simpleContractUri);
    expect(functions.length).gt(0);
  });

  it("should extract features", async () => {
    expect(
      isFeatureEnabled(TokenERC721__factory.abi, "ERC721Enumerable"),
    ).to.eq(true);
    expect(isFeatureEnabled(TokenERC721__factory.abi, "ERC721Mintable")).to.eq(
      true,
    );
    expect(
      isFeatureEnabled(TokenERC721__factory.abi, "ERC721BatchMintable"),
    ).to.eq(true);

    // Drop
    expect(isFeatureEnabled(DropERC721__factory.abi, "ERC721Enumerable")).to.eq(
      true,
    );
    expect(isFeatureEnabled(DropERC721__factory.abi, "ERC721Supply")).to.eq(
      true,
    );
    expect(isFeatureEnabled(DropERC721__factory.abi, "ERC721Mintable")).to.eq(
      false,
    );
  });

  it("should update bio", async () => {
    const address = adminWallet.address;
    const publisher = sdk.getPublisher();
    await publisher.updatePublisherProfile({
      name: "John",
      bio: "Hello",
      github: "something",
    });
    const profile = await publisher.getPublisherProfile(address);
    expect(profile.name).to.eq("John");
    expect(profile.bio).to.eq("Hello");
    expect(profile.github).to.eq("something");
  });

  it("should match back publish metadata", async () => {
    const publisher = sdk.getPublisher();
    const tx = await publisher.publish(simpleContractUri, {
      version: "0.0.1",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [],
    );
    expect(deployedAddr.length).to.be.gt(0);
    const compilerMetaUri = await resolveContractUriFromAddress(
      deployedAddr,
      sdk.getProvider(),
    );
    invariant(compilerMetaUri, "compilerMetaUri not found");
    const publishMeta =
      await publisher.resolvePublishMetadataFromCompilerMetadata(
        compilerMetaUri,
      );
    expect(publishMeta[0].publisher).to.eq(adminWallet.address);
    expect(publishMeta[0].name).to.eq("Greeter");
    expect(publishMeta[0].version).to.eq("0.0.1");
  });

  it("should publish simple greeter contract", async () => {
    const publisher = sdk.getPublisher();
    const tx = await publisher.publish(simpleContractUri, {
      version: "0.0.2",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [],
    );
    expect(deployedAddr.length).to.be.gt(0);
    const all = await publisher.getAll(adminWallet.address);
    expect(all.length).to.be.eq(2); // mock publisher always returns a mock contract
    // fetch metadata back
    const c = await sdk.getContract(deployedAddr);
    const meta = await c.metadata.get();
    expect(meta.name).to.eq("MyToken");
  });

  it("should publish multiple versions", async () => {
    sdk.updateSignerOrProvider(samWallet);
    const publisher = sdk.getPublisher();
    let id = "";
    for (let i = 0; i < 5; i++) {
      const tx = await publisher.publish(simpleContractUri, {
        version: `${i}.0.0`,
      });
      id = (await tx.data()).id;
    }
    const all = await publisher.getAll(samWallet.address);
    const versions = await publisher.getAllVersions(samWallet.address, id);
    expect(all.length).to.be.eq(2);
    expect(versions.length).to.be.eq(5);
    expect(all[all.length - 1] === versions[versions.length - 1]);
    const last = await publisher.getLatest(samWallet.address, id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const c = await publisher.fetchPublishedContractInfo(last!);
    expect(c.publishedMetadata.version).to.eq("4.0.0");
  });

  it("should fetch metadata", async () => {
    const publisher = sdk.getPublisher();
    const meta = await publisher.fetchCompilerMetadataFromPredeployURI(
      simpleContractUri,
    );
    expect(meta.licenses.join()).to.eq("MIT,Apache-2.0");
  });

  it("should fetch metadata from previously deployed version", async () => {
    const publisher = sdk.getPublisher();
    for (let i = 1; i < 3; i++) {
      await publisher.publish(simpleContractUri, {
        version: `${i}.0.0`,
        displayName: `Greeter${i.toString()}`,
      });
    }
    const meta = await publisher.fetchPrePublishMetadata(
      simpleContractUri,
      adminWallet.address,
    );
    expect(meta.preDeployMetadata.licenses.join()).to.eq("MIT,Apache-2.0");
  });

  it("should publish extra metadata", async () => {
    const publisher = sdk.getPublisher();
    const tx = await publisher.publish(simpleContractUri, {
      version: "3.0.1",
      description: "description",
      tags: ["tag1", "tag2"],
    });
    const contract = await tx.data();
    const last = await publisher.getLatest(adminWallet.address, contract.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const c = await publisher.fetchPublishedContractInfo(last!);
    expect(c.publishedMetadata.version).to.eq("3.0.1");
    expect(c.publishedMetadata.description).to.eq("description");
  });

  it("should publish constructor params contract", async () => {
    sdk.updateSignerOrProvider(bobWallet);
    const publisher = sdk.getPublisher();
    const tx = await publisher.publish(contructorParamsContractUri, {
      version: "0.0.1",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [
        adminWallet.address,
        "0x1234",
        12345,
        [adminWallet.address, samWallet.address],
        [12, 23, 45],
      ],
    );
    expect(deployedAddr.length).to.be.gt(0);
    const all = await publisher.getAll(bobWallet.address);
    expect(all.length).to.be.eq(2); // mock publisher always returns a mock contract
  });

  it("test factory deploy", async () => {
    const realSDK = new ThirdwebSDK(adminWallet);
    const pub = await realSDK.getPublisher();
    const tx = await pub.publish(
      "ipfs://QmfGqbJKvrVDhw747YPXKf26GiuXXo4GkwUg3FcjgYzx8r",
      {
        version: "0.0.1",
        isDeployableViaFactory: true,
        factoryDeploymentData: {
          implementationInitializerFunction: "initialize",
          implementationAddresses: {
            [ChainId.Hardhat]: implementations["nft-collection"] || "",
          },
          factoryAddresses: {
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            [ChainId.Hardhat]: (process.env.factoryAddress as string) || "",
          },
        },
      },
    );
    const contract = await tx.data();
    expect(contract.id).to.eq("TokenERC721");
    const deployedAddr = await realSDK.deployer.deployContractFromUri(
      contract.metadataUri,
      [
        adminWallet.address,
        "test factory",
        "ffs",
        "",
        [],
        adminWallet.address,
        adminWallet.address,
        0,
        0,
        adminWallet.address,
      ],
    );
    expect(deployedAddr.length).to.be.gt(0);
  });

  it("test proxy deploy", async () => {
    const realSDK = new ThirdwebSDK(adminWallet);
    const pub = realSDK.getPublisher();
    const tx = await pub.publish(
      "ipfs://QmfGqbJKvrVDhw747YPXKf26GiuXXo4GkwUg3FcjgYzx8r",
      {
        version: "0.0.2",
        isDeployableViaProxy: true,
        factoryDeploymentData: {
          implementationInitializerFunction: "initialize",
          implementationAddresses: {
            [ChainId.Hardhat]: implementations["nft-collection"] || "",
          },
        },
      },
    );
    const contract = await tx.data();
    expect(contract.id).to.eq("TokenERC721");
    const deployedAddr = await realSDK.deployer.deployContractFromUri(
      contract.metadataUri,
      [
        adminWallet.address,
        "test factory",
        "ffs",
        "",
        [],
        adminWallet.address,
        adminWallet.address,
        0,
        0,
        adminWallet.address,
      ],
    );
    expect(deployedAddr.length).to.be.gt(0);
  });

  it("SimpleAzuki enumerable", async () => {
    const realSDK = new ThirdwebSDK(adminWallet);
    const pub = await realSDK.getPublisher();
    const ipfsUri = "ipfs://QmTKKUUEU6GnG7VEEAAXpveeirREC1JNYntVJGhHKhqcYZ/0";
    const tx = await pub.publish(ipfsUri, {
      version: "0.0.1",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [],
    );
    const c = await realSDK.getContract(deployedAddr);
    const all = await c.erc721.getAll();
    expect(all.length).to.eq(0);
  });

  it("AzukiWithMinting mintable", async () => {
    const pub = await sdk.getPublisher();
    const ipfsUri = "ipfs://QmPPPoKk2mwoxBVTW5qMMNwaV4Ja5qDoq7fFZNFFvr3YsW/1";
    const tx = await pub.publish(ipfsUri, {
      version: "0.0.1",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [10, "bar"],
    );
    const c = await sdk.getContract(deployedAddr);
    const tx2 = await c.erc721.mintTo(adminWallet.address, {
      name: "cool nft",
    });
    const nft = await c.erc721.get(tx2.id);
    expect(nft.metadata.name).to.eq("cool nft");
    const all = await c.erc721.getAll();
    expect(all.length).to.eq(1);
    invariant(c.royalties, "no royalties detected");
    const prevMeta = await c.metadata.get();
    expect(prevMeta.name).to.eq("AzukiMint");
    expect(prevMeta.description).to.eq(
      "Azuki contract that can be fully used in the thirdweb dashboard",
    );
    await c.metadata.set({
      name: "Hello",
    });
    const meta = await c.metadata.get();
    expect(meta.name).to.eq("Hello");
  });

  it("ERC721Dropable multiphase feature detection", async () => {
    const ipfsUri = "ipfs://QmWaidQMSYHPzYYZCxMc2nSk2vrD28mS43Xc9k7QFyAGja/0";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, []);
    const c = await sdk.getContract(addr);

    let claimConditions = await c.erc721.claimConditions.getAll();
    expect(claimConditions.length).to.equal(0);

    await c.erc721.claimConditions.set([
      {
        price: "0",
        startTime: new Date(0),
      },
      {
        price: "0",
        startTime: new Date(),
      },
    ]);

    claimConditions = await c.erc721.claimConditions.getAll();
    expect(claimConditions.length).to.equal(2);
  });

  it("ERC721Drop base feature detection", async () => {
    const ipfsUri = "ipfs://QmXQ2f6qA7FD8uks1hKK1soTn6sbEGBSfDpzN9buYXkGxZ";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, []);
    const c = await sdk.getContract(addr);

    const nftsBefore = await c.erc721.getAll();
    expect(nftsBefore.length).to.equal(0);

    const tx = await c.erc721.lazyMint([
      {
        name: "cool nft 1",
      },
      {
        name: "cool nft 2",
      },
    ]);
    expect(tx.length).to.eq(2);

    await c.erc721.claimConditions.set([
      {
        price: "0",
        maxQuantity: 2,
        startTime: new Date(0),
      },
    ]);
    await c.erc721.claimTo(adminWallet.address, 1);

    const nftsAfter = await c.erc721.getAll();
    expect(nftsAfter.length).to.equal(2);
    expect(nftsAfter[0].metadata.name).to.equal("cool nft 1");
    expect(nftsAfter[0].owner).to.equal(adminWallet.address);
    expect(nftsAfter[1].metadata.name).to.equal("cool nft 2");
    expect(nftsAfter[1].owner).to.equal(AddressZero);
  });

  it("ERC1155Drop base feature detection", async () => {
    const ipfsUri = "ipfs://QmZsZcLS3fAtPw2EyZGbHxkdeofTxNtqMoXNWLc79sRXWa";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      "test",
      "test",
    ]);
    const c = await sdk.getContract(addr);

    const nftsBefore = await c.erc1155.getAll();
    expect(nftsBefore.length).to.equal(0);

    const tx = await c.erc1155.lazyMint([
      {
        name: "cool nft 1",
      },
      {
        name: "cool nft 2",
      },
    ]);
    expect(tx.length).to.eq(2);

    await c.erc1155.claimConditions.set(0, [
      {
        price: "0",
        maxQuantity: 2,
        startTime: new Date(0),
      },
    ]);
    await c.erc1155.claimTo(adminWallet.address, 0, 1);

    const nftsAfter = await c.erc1155.getAll();
    expect(nftsAfter.length).to.equal(2);
    expect(nftsAfter[0].metadata.name).to.equal("cool nft 1");
    expect(nftsAfter[0].supply.toNumber()).to.equal(1);
    expect(nftsAfter[1].metadata.name).to.equal("cool nft 2");
    expect(nftsAfter[1].supply.toNumber()).to.equal(0);
  });

  it("Constructor params with tuples", async () => {
    const ipfsUri = "ipfs://QmZQa56Cj1gFnZgKSkvGE5uzhaQrQV3nU6upDWDusCaCwY/0";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      "0x1234",
      "123",
      JSON.stringify(["0x1234", "0x4567"]),
      JSON.stringify([
        213,
        ethers.utils.hexZeroPad("0x1234", 32),
        [adminWallet.address, samWallet.address],
      ]),
    ]);
    const c = await sdk.getContract(addr);
    const uri = await c.call("contractUri");
    expect(uri).to.eq(ethers.utils.hexZeroPad("0x1234", 32));

    const tx = await c.call("updateStruct", {
      aNumber: 123,
      aString: ethers.utils.hexZeroPad("0x1234", 32),
      anArray: [adminWallet.address, samWallet.address],
    });
    expect(tx).to.not.eq(undefined);
  });
});
