import { ThirdwebSDK } from "../../src/evm";
import { extendedMetadataMock, sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "ethers";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  Forwarder__factory,
  TokenERC721__factory,
} from "@thirdweb-dev/contracts-js";
import {
  bytecode as TWCloneFactoryBytecode,
  abi as TWCloneFactoryAbi,
} from "./metadata/TWCloneFactory";

describe("Transactions", async () => {
  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;
  let mockPublishUri: string;

  before(async () => {
    [adminWallet, samWallet] = signers;

    mockPublishUri = await mockUploadMetadataWithBytecode(
      "TokenERC721",
      TokenERC721__factory.abi,
      TokenERC721__factory.bytecode,
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
  });

  it("Should succesfully prepare and execute a transaction", async () => {
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
    const address = await sdk.deployer.deployContractFromUri(mockPublishUri, [
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
    process.env.contractPublisherAddress = mockPublisher;

    const contract = await sdk.getContract(address, "nft-collection");

    let isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(false);

    const tx = await contract.prepare("setApprovalForAll", [
      samWallet.address,
      true,
    ]);
    await tx.execute();

    isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(true);
  });

  it("Should successfully sign and send transaction", async () => {
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      adminWallet.provider,
    );
    const signerSdk = new ThirdwebSDK(wallet, {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const mockPublisher = process.env.contractPublisherAddress;
    process.env.contractPublisherAddress =
      "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808";
    const address = await sdk.deployer.deployContractFromUri(mockPublishUri, [
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
    process.env.contractPublisherAddress = mockPublisher;
    const contract = await signerSdk.getContract(address, "nft-collection");

    let isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(false);

    const tx = await contract.setApprovalForAll.prepare(
      samWallet.address,
      true,
    );
    const signedTx = await tx.sign();
    await sdk.getProvider().sendTransaction(signedTx);

    isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(true);
  });
});
