import { ChainId, resolveContractUriFromAddress } from "../../src/evm";
import {
  extendedMetadataMock,
  defaultProvider,
  implementations,
  signers,
  sdk,
} from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DropERC1155__factory,
  DropERC721__factory,
  ERC1155Drop__factory,
  ERC1155SignatureMint__factory,
  ERC721Drop__factory,
  MarketplaceV3__factory,
  TokenERC721__factory,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { expect } from "chai";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import invariant from "tiny-invariant";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  greeterBytecode,
  greeterCompilerMetadata,
} from "./mock/greeterContractMetadata";
import {
  constructorParamBytecode,
  constructorParamMetadata,
} from "./mock/constructorParamContractMetadata";
import {
  simpleAzukiBytecode,
  simpleAzukiMetadata,
} from "./mock/simpleAzukiMetadata";
import {
  azukiMintableBytecode,
  azukiMintableCompilerMetadata,
} from "./mock/azukiMintableMetadata";
import {
  constructorParamsWithTuplesBytecode,
  constructorParamsWithTuplesMetadata,
} from "./mock/constructorParamWithTuplesMetadata";
import { catAttackBytecode, catAttackMetadata } from "./mock/catAttackMetadata";

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
  let constructorParamsContractUri: string;
  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;
  let bobWallet: SignerWithAddress;
  // let sdk: ThirdwebSDK;

  before("Upload abis", async () => {
    [adminWallet, samWallet, bobWallet] = signers;
    // sdk = new ThirdwebSDK(adminWallet, {
    //   secretKey: process.env.TW_SECRET_KEY,
    // });
    simpleContractUri = await mockUploadMetadataWithBytecode(
      "Greeter",
      greeterCompilerMetadata.output.abi,
      greeterBytecode,
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
      "ipfs://QmNPcYsXDAZvQZXCG73WSjdiwffZkNkoJYwrDDtcgM142A/0",
    );
    // if we change the test data - await uploadContractMetadata("Greeter", storage);
    constructorParamsContractUri = await mockUploadMetadataWithBytecode(
      "ConstructorParams",
      constructorParamMetadata.output.abi,
      constructorParamBytecode,
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
      "ipfs://QmT5Dx3xigHr6BPG8scxbX7JaAucHRD9UPXc6FCtgcNn5e/0",
    );
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("should extract functions", async () => {
    const publisher = sdk.getPublisher();
    const functions = await publisher.extractFunctions(simpleContractUri);
    expect(functions.length).gt(0);
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

  it.skip("should fetch metadata", async () => {
    const publisher = sdk.getPublisher();
    const meta =
      await publisher.fetchCompilerMetadataFromPredeployURI(simpleContractUri);
    expect(meta.licenses.join()).to.eq("MIT,Apache-2.0");
  });

  it.skip("should fetch metadata from previously deployed version", async () => {
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
    const tx = await publisher.publish(constructorParamsContractUri, {
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
    const publishUri = await mockUploadMetadataWithBytecode(
      "TokenERC721",
      TokenERC721__factory.abi,
      TokenERC721__factory.bytecode,
      "",
    );
    const pub = await sdk.getPublisher();
    const tx = await pub.publish(publishUri, {
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
    });
    const contract = await tx.data();
    expect(contract.id).to.eq("TokenERC721");
    const deployedAddr = await sdk.deployer.deployContractFromUri(
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
    const publishUri = await mockUploadMetadataWithBytecode(
      "TokenERC721",
      TokenERC721__factory.abi,
      TokenERC721__factory.bytecode,
      "",
    );
    const pub = sdk.getPublisher();
    const tx = await pub.publish(publishUri, {
      version: "0.0.2",
      isDeployableViaProxy: true,
      factoryDeploymentData: {
        implementationInitializerFunction: "initialize",
        implementationAddresses: {
          [ChainId.Hardhat]: implementations["nft-collection"] || "",
        },
      },
    });
    const contract = await tx.data();
    expect(contract.id).to.eq("TokenERC721");
    const deployedAddr = await sdk.deployer.deployContractFromUri(
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
    const pub = await sdk.getPublisher();
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "SimpleAzuki",
      simpleAzukiMetadata.output.abi,
      simpleAzukiBytecode,
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
      "ipfs://QmNYEakT858Vvioib6oEGjgKff4xRnWcuXPxHm3svDXm2B/0",
    );
    // ("ipfs://QmTKKUUEU6GnG7VEEAAXpveeirREC1JNYntVJGhHKhqcYZ/0");

    const tx = await pub.publish(ipfsUri, {
      version: "0.0.1",
    });
    const contract = await tx.data();
    const deployedAddr = await sdk.deployer.deployContractFromUri(
      contract.metadataUri,
      [],
    );
    const c = await sdk.getContract(deployedAddr);
    const all = await c.erc721.getAll();
    expect(all.length).to.eq(0);
  });

  it("AzukiWithMinting mintable", async () => {
    const pub = await sdk.getPublisher();
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "AzukiMint",
      azukiMintableCompilerMetadata.output.abi,
      azukiMintableBytecode,
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
    // ("ipfs://QmPPPoKk2mwoxBVTW5qMMNwaV4Ja5qDoq7fFZNFFvr3YsW/1");
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

    await c.metadata.set({
      name: "Hello",
    });
    const meta = await c.metadata.get();
    expect(meta.name).to.eq("Hello");
  });

  it("ERC721Droppable multiphase feature detection", async () => {
    const ipfsUri = await mockUploadMetadataWithBytecode(
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
        publisher: adminWallet.address,
      },
    );
    // ("ipfs://Qmbu57WNPmmGuNZEiEAVi9yeXxGK2GkJRBbRMaPxs9KS5b");
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      adminWallet.address,
      "NFT",
      "NFT",
      "",
      [],
      adminWallet.address,
      adminWallet.address,
      0,
      0,
      adminWallet.address,
    ]);
    const c = await sdk.getContract(addr);
    process.env.contractPublisherAddress = mockPublisher;

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
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "ERC721Drop",
      ERC721Drop__factory.abi,
      ERC721Drop__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
    );
    // ("ipfs://QmXQ2f6qA7FD8uks1hKK1soTn6sbEGBSfDpzN9buYXkGxZ");
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      adminWallet.address,
      "NFT",
      "NFT",
      adminWallet.address,
      0,
      adminWallet.address,
    ]);
    const c = await sdk.getContract(addr);
    process.env.contractPublisherAddress = mockPublisher;

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
        maxClaimableSupply: 2,
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
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "ERC1155Drop",
      ERC1155Drop__factory.abi,
      ERC1155Drop__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
    );
    ("ipfs://QmZsZcLS3fAtPw2EyZGbHxkdeofTxNtqMoXNWLc79sRXWa");
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      adminWallet.address,
      "NFT",
      "NFT",
      adminWallet.address,
      0,
      adminWallet.address,
    ]);
    const c = await sdk.getContract(addr);
    process.env.contractPublisherAddress = mockPublisher;

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
        maxClaimableSupply: 2,
        startTime: new Date(0),
      },
    ]);
    await c.erc1155.claimTo(adminWallet.address, 0, 1);

    const nftsAfter = await c.erc1155.getAll();
    expect(nftsAfter.length).to.equal(2);
    expect(nftsAfter[0].metadata.name).to.equal("cool nft 1");
    expect(nftsAfter[0].supply).to.equal("1");
    expect(nftsAfter[1].metadata.name).to.equal("cool nft 2");
    expect(nftsAfter[1].supply).to.equal("0");
  });

  it("ERC1155Signature mint feature detection", async () => {
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "DropERC721",
      ERC1155SignatureMint__factory.abi,
      ERC1155SignatureMint__factory.bytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
    );
    // ("ipfs://QmNuKYGZoiHyumKjT7gPk3vwy3WKt7gTf1hKGZ2eyGZGRd");
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7";
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      adminWallet.address,
      "NFT",
      "NFT",
      adminWallet.address,
      0,
      adminWallet.address,
    ]);
    const c = await sdk.getContract(addr);
    process.env.contractPublisherAddress = mockPublisher;
    const payload = {
      metadata: {
        name: "SigMinted Edition",
      },
      to: samWallet.address, // Who will receive the NFT (or AddressZero for anyone)
      price: 0.5, // the price to pay for minting
      royaltyBps: 100, // custom royalty fees for this NFT (in bps)
      quantity: "1",
    };

    const goodPayload = await c.erc1155.signature.generate(payload);
    const valid = await c.erc1155.signature.verify(goodPayload);
    expect(valid).to.eq(true);
    const tx = await c.erc1155.signature.mint(goodPayload);
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("Constructor params with tuples", async () => {
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "ConstructorParamWithTuples",
      constructorParamsWithTuplesMetadata.output.abi,
      constructorParamsWithTuplesBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
    );
    // ("ipfs://QmZQa56Cj1gFnZgKSkvGE5uzhaQrQV3nU6upDWDusCaCwY/0");
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

    const tx = await c.call("updateStruct", [
      {
        aNumber: 123,
        aString: ethers.utils.hexZeroPad("0x1234", 32),
        anArray: [adminWallet.address, samWallet.address],
      },
    ]);
    expect(tx).to.not.eq(undefined);
  });

  it("bytes4 test", async () => {
    const ipfsUri = await mockUploadMetadataWithBytecode(
      "CatAttackNFT",
      catAttackMetadata.output.abi,
      catAttackBytecode,
      "",
      {
        ...extendedMetadataMock,
        deployType: "standard",
        networksForDeployment: {
          allNetworks: true,
          networksEnabled: [],
        },
        publisher: adminWallet.address,
      },
    );
    // ("ipfs://QmTTdsRTtxQXHfUwCGK6epXhvuEwjBwLFcCjGUYDRUQc95");
    const addr = await sdk.deployer.deployContractFromUri(ipfsUri, [
      "test",
      "tt",
      "0x01551220", // bytes4 param
    ]);
    expect(addr).to.not.eq(undefined);
  });

  it("Composite Abi for Extension Router", async () => {
    const ipfsHash = (await resolveContractUriFromAddress(
      implementations["marketplace-v3"] as string,
      defaultProvider,
    )) as string;

    const pub = await sdk.getPublisher();
    const tx = await pub.publish(ipfsHash.concat("rawMeta"), {
      version: "0.0.1",
      isDeployableViaFactory: true,
      factoryDeploymentData: {
        implementationInitializerFunction: "initialize",
        implementationAddresses: {
          [ChainId.Hardhat]: implementations["marketplace-v3"] || "",
        },
        factoryAddresses: {
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          [ChainId.Hardhat]: (process.env.factoryAddress as string) || "",
        },
      },
    });
    const contract = await tx.data();
    expect(contract.id).to.eq("MarketplaceV3");

    const fullMetadata = await pub.fetchFullPublishMetadata(
      contract.metadataUri,
    );
    const compositeAbi = fullMetadata.compositeAbi;
    expect(
      compositeAbi != undefined &&
        compositeAbi.length > MarketplaceV3__factory.abi.length,
    );
  });
});
