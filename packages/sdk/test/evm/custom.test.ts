import {
  NATIVE_TOKEN_ADDRESS,
  PayloadToSign20,
  SignedPayload721WithQuantitySignature,
} from "../../src/evm";
import {
  expectError,
  signers,
  sdk,
  extendedMetadataMock,
} from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  TokenERC20__factory,
  TokenERC721__factory,
  VoteERC20__factory,
} from "@thirdweb-dev/contracts-js";
import { assert, expect } from "chai";
import { ethers } from "ethers";
import invariant from "tiny-invariant";
import { mockUploadMetadataWithBytecode } from "./utils";
import {
  greeterBytecode,
  greeterCompilerMetadata,
} from "./mock/greeterContractMetadata";

describe("Custom Contracts", async () => {
  let customContractAddress: string;
  let nftContractAddress: string;
  let tokenContractAddress: string;
  let editionContractAddress: string;
  let editionDropContractAddress: string;
  let tokenDropContractAddress: string;
  let sigDropContractAddress: string;
  let nftDropContractAddress: string;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;
  let simpleContractUri: string;

  before(async () => {
    [adminWallet, samWallet, bobWallet] = signers;
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
    // "ipfs://QmNPcYsXDAZvQZXCG73WSjdiwffZkNkoJYwrDDtcgM142A/0";
    // if we update the test data - await uploadContractMetadata("Greeter", storage);

    // only create this once by default (hits IPFS!)
    // TODO use mock storage instead
    customContractAddress = await sdk.deployer.deployContractFromUri(
      simpleContractUri,
      [],
    );
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    nftContractAddress = await sdk.deployer.deployNFTCollection({
      name: `Drop`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      primary_sale_recipient: samWallet.address,
      seller_fee_basis_points: 500,
      fee_recipient: bobWallet.address,
      platform_fee_basis_points: 10,
      platform_fee_recipient: adminWallet.address,
    });
    editionContractAddress = await sdk.deployer.deployEdition({
      name: `Edition`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      primary_sale_recipient: samWallet.address,
      seller_fee_basis_points: 500,
      fee_recipient: bobWallet.address,
      platform_fee_basis_points: 10,
      platform_fee_recipient: adminWallet.address,
    });
    tokenContractAddress = await sdk.deployer.deployToken({
      name: `Token`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      primary_sale_recipient: samWallet.address,
      platform_fee_basis_points: 10,
      platform_fee_recipient: adminWallet.address,
    });
    editionDropContractAddress = await sdk.deployer.deployEditionDrop({
      name: "EditionDrop",
      primary_sale_recipient: samWallet.address,
    });
    tokenDropContractAddress = await sdk.deployer.deployTokenDrop({
      name: "TokenDrop",
      primary_sale_recipient: samWallet.address,
    });
    sigDropContractAddress = await sdk.deployer.deploySignatureDrop({
      name: "sigdrop",
      primary_sale_recipient: adminWallet.address,
    });
    nftDropContractAddress = await sdk.deployer.deployNFTDrop({
      name: "nftdrop",
      primary_sale_recipient: adminWallet.address,
    });
  });

  it("should call raw ABI functions and read deployer address", async () => {
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");
    expect(await c.call("decimals")).to.eq(18);
    const owner = await c.call("owner");
    expect(owner).to.eq(adminWallet.address);

    const tx = await c.call("setOwner", [samWallet.address]);
    expect(tx.receipt).to.not.eq(undefined);
    const owner2 = await c.call("owner");
    expect(owner2).to.eq(samWallet.address);
  });

  it("should call raw ABI functions with call overrides", async () => {
    //need to re-create it here because owner is changed and it would otherwise fail
    customContractAddress = await sdk.deployer.deployContractFromUri(
      simpleContractUri,
      [],
    );
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");

    try {
      await c.call("setOwner", [samWallet.address], {
        value: ethers.utils.parseEther("0.1"),
      });
    } catch (e) {
      expectError(e, "non-payable method");
    }

    try {
      await c.call("setOwner", [
        samWallet.address,
        {
          somObj: "foo",
        },
      ]);
    } catch (e) {
      expectError(e, "requires 1 arguments, but 2 were provided");
    }

    const tx = await c.call("setOwner", [samWallet.address], {
      gasLimit: 300_000,
    });
    expect(tx.receipt).to.not.eq(undefined);
  });

  it("should fetch published metadata", async () => {
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");
    const meta = await c.publishedMetadata.get();
    expect(meta.name).to.eq("Greeter");
    // expect(meta.licenses.length).gt(0);
  });

  it("should extract functions", async () => {
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");
    const functions = await c.publishedMetadata.extractFunctions();
    expect(functions.length).gt(0);
  });

  it("should extract events", async () => {
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");
    const events = await c.publishedMetadata.extractEvents();
    expect(events.length).gt(0);
  });

  it("should detect feature: metadata", async () => {
    const c = await sdk.getContract(customContractAddress);
    invariant(c, "Contract undefined");
    invariant(c.metadata, "Contract undefined");
    const meta = await c.metadata.get();
    expect(meta.name).to.eq("MyToken");
  });

  it("should detect feature: roles", async () => {
    const c = await sdk.getContract(nftContractAddress);
    invariant(c, "Contract undefined");
    invariant(c.roles, "Roles undefined");
    const admins = await c.roles.get("admin");
    expect(admins[0]).to.eq(adminWallet.address);
    const minters = await c.roles.get("minter");
    expect(minters[0]).to.eq(adminWallet.address);
    expect(minters.length).to.eq(1);
    await c.roles.grant("minter", samWallet.address);
    const minters2 = await c.roles.get("minter");
    expect(minters2.length).to.eq(2);
    expect(minters2[0]).to.eq(adminWallet.address);
    expect(minters2[1]).to.eq(samWallet.address);
  });

  it("should detect feature: royalties", async () => {
    const c = await sdk.getContract(nftContractAddress);
    invariant(c, "Contract undefined");
    invariant(c.royalties, "Royalties undefined");
    const royalties = await c.royalties.getDefaultRoyaltyInfo();
    expect(royalties.fee_recipient).to.eq(bobWallet.address);
    expect(royalties.seller_fee_basis_points).to.eq(500);
    await c.royalties.setDefaultRoyaltyInfo({
      fee_recipient: samWallet.address,
      seller_fee_basis_points: 1000,
    });
    const royalties2 = await c.royalties.getDefaultRoyaltyInfo();
    expect(royalties2.fee_recipient).to.eq(samWallet.address);
    expect(royalties2.seller_fee_basis_points).to.eq(1000);
  });

  it("should detect feature: primary sales", async () => {
    const c = await sdk.getContract(nftContractAddress);
    invariant(c, "Contract undefined");
    invariant(c.sales, "Primary sales undefined");
    const recipient = await c.sales.getRecipient();
    expect(recipient).to.eq(samWallet.address);
    await c.sales.setRecipient(bobWallet.address);
    const recipient2 = await c.sales.getRecipient();
    expect(recipient2).to.eq(bobWallet.address);
  });

  it("should detect feature: primary sales", async () => {
    const c = await sdk.getContract(nftContractAddress);
    invariant(c, "Contract undefined");
    invariant(c.platformFees, "Platform fees undefined");
    const fees = await c.platformFees.get();
    expect(fees.platform_fee_recipient).to.eq(adminWallet.address);
    expect(fees.platform_fee_basis_points).to.eq(10);
    await c.platformFees.set({
      platform_fee_recipient: samWallet.address,
      platform_fee_basis_points: 500,
    });
    const fees2 = await c.platformFees.get();
    expect(fees2.platform_fee_recipient).to.eq(samWallet.address);
    expect(fees2.platform_fee_basis_points).to.eq(500);
  });

  it("should not detect feature if missing from ABI", async () => {
    const address = await sdk.deployer.deployVote({
      name: "My Vote",
      voting_token_address: adminWallet.address,
    });
    const c = await sdk.getContractFromAbi(address, VoteERC20__factory.abi);
    invariant(c, "Contract undefined");
    invariant(c.metadata, "Metadata undefined");
    try {
      c.roles.get("admin");
    } catch (e) {
      expectError(e, "contract does not implement the 'Permissions' Extension");
    }
  });

  it("should detect feature: erc20", async () => {
    const c = await sdk.getContract(tokenContractAddress);
    const token = await c.erc20.get();
    expect(token.name).to.eq("Token");
    expect(token.decimals).to.eq(18);
    await c.erc20.mint(100);
    const balance = await c.erc20.balance();
    expect(balance.displayValue).to.eq("100.0");
    await c.erc20.transfer(samWallet.address, 25);
    expect((await c.erc20.balance()).displayValue).to.eq("75.0");
    expect((await c.erc20.balanceOf(samWallet.address)).displayValue).to.eq(
      "25.0",
    );
  });

  it("should detect feature: erc20 burnable", async () => {
    const c = await sdk.getContract(tokenContractAddress);
    await c.erc20.mint(2);
    expect((await c.erc20.balance()).displayValue).to.eq("2.0");
    await c.erc20.burn(1);
    expect((await c.erc20.balance()).displayValue).to.eq("1.0");
  });

  it("should detect feature: erc20 droppable", async () => {
    const c = await sdk.getContract(tokenDropContractAddress);

    invariant(c, "Contract undefined");

    await c.erc20.claimConditions.set([
      {
        startTime: new Date(new Date().getTime() - 1000 * 60 * 60),
        price: 0,
        maxClaimableSupply: 10,
      },
    ]);

    let b = await c.erc20.balance();
    expect(b.displayValue).to.equal("0.0");

    await c.erc20.claim(5);

    b = await c.erc20.balance();
    expect(b.displayValue).to.equal("5.0");
  });

  it("should detect feature: erc721", async () => {
    const c = await sdk.getContract(nftContractAddress);
    await c.erc721.mintTo(adminWallet.address, {
      name: "Custom NFT",
    });
    const nfts = await c.erc721.getAll();
    expect(nfts.length).to.eq(1);
    expect(nfts[0].metadata.name).to.eq("Custom NFT");
  });

  it("should transfer erc721", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: adminWallet.address,
    });
    const c = await sdk.getContract(address);

    await c.erc721.mintTo(adminWallet.address, {
      name: "Custom NFT",
    });
    let initialBalance = await c.erc721.balanceOf(samWallet.address);
    await c.erc721.transfer(samWallet.address, 0);
    let balance = await c.erc721.balanceOf(samWallet.address);
    expect(balance.toString()).to.eq(initialBalance.add(1).toString());

    await c.erc721.mintTo(adminWallet.address, {
      name: "Custom NFT",
    });
    initialBalance = await c.erc721.balanceOf(samWallet.address);
    const tx = await c.erc721.transfer.prepare(samWallet.address, 1);
    await tx.execute();
    balance = await c.erc721.balanceOf(samWallet.address);
    expect(balance.toString()).to.eq(initialBalance.add(1).toString());
  });

  it("should batch transfer erc1155", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployEdition({
      name: "Edition",
      primary_sale_recipient: adminWallet.address,
    });
    const c = await sdk.getContract(address);

    await c.erc1155.mintBatchTo(adminWallet.address, [
      {
        metadata: {
          name: "Custom NFT",
        },
        supply: 100,
      },
      {
        metadata: {
          name: "Custom NFT",
        },
        supply: 100,
      },
    ]);

    const initialBalance = await c.erc1155.balanceOf(samWallet.address, 0);
    const tx = await c.erc1155.transferBatch.prepare(
      samWallet.address,
      [0, 1],
      [1, 1],
    );
    await tx.execute();
    const balance = await c.erc1155.balanceOf(samWallet.address, 0);
    expect(balance.toString()).to.eq(initialBalance.add(1).toString());
  });

  it("should detect feature: erc721 burnable", async () => {
    const c = await sdk.getContract(nftContractAddress);
    await c.erc721.mintTo(adminWallet.address, {
      name: "Custom NFT",
    });
    let balance = await c.erc721.balance();
    expect(balance.toString()).to.eq("1");
    await c.erc721.burn(0);
    balance = await c.erc721.balance();
    expect(balance.toString()).to.eq("0");
  });

  it("should detect feature: erc721 lazy mint", async () => {
    const c = await sdk.getContract(sigDropContractAddress);
    await c.erc721.lazyMint([
      {
        name: "Custom NFT",
      },
      {
        name: "Another one",
      },
    ]);
    const nfts = await c.erc721.getAll();
    expect(nfts.length).to.eq(2);
    expect(nfts[0].metadata.name).to.eq("Custom NFT");
  });

  it("should detect feature: erc721 delay reveal", async () => {
    const c = await sdk.getContract(nftDropContractAddress);
    await c.erc721.revealer.createDelayedRevealBatch(
      {
        name: "Placeholder #1",
      },
      [{ name: "NFT #1" }, { name: "NFT #2" }, { name: "NFT #3" }],
      "password",
    );

    const batches = await c.erc721.revealer.getBatchesToReveal();
    expect(batches.length).to.eq(1);

    await c.erc721.revealer.reveal(0, "password");
    expect((await c.erc721.get(0)).metadata.name).to.be.equal("NFT #1");
  });

  it("should detect feature: erc1155", async () => {
    const c = await sdk.getContract(editionContractAddress);
    await c.erc1155.mint({
      metadata: {
        name: "Custom NFT",
      },
      supply: 100,
    });
    const nfts = await c.erc1155.getAll();
    expect(nfts.length).to.eq(1);
    expect(nfts[0].metadata.name).to.eq("Custom NFT");
  });

  it("should detect feature: erc1155 burnable", async () => {
    const c = await sdk.getContract(editionContractAddress);
    await c.erc1155.mintBatchTo(adminWallet.address, [
      {
        metadata: {
          name: "Custom NFT",
        },
        supply: 100,
      },
      {
        metadata: {
          name: "Custom NFT",
        },
        supply: 100,
      },
    ]);

    let balance = await c.erc1155.balance(0);
    expect(balance.toString()).to.eq("100");
    await c.erc1155.burn(0, 10);
    balance = await c.erc1155.balance(0);
    expect(balance.toString()).to.eq("90");

    await c.erc1155.burnBatch([0, 1], [10, 10]);
    balance = await c.erc1155.balance(0);
    expect(balance.toString()).to.eq("80");
    balance = await c.erc1155.balance(1);
    expect(balance.toString()).to.eq("90");
  });

  it("should detect feature: erc1155 lazy mint", async () => {
    const c = await sdk.getContract(editionDropContractAddress);
    await c.erc1155.lazyMint([
      {
        name: "Custom NFT",
      },
      {
        name: "Another one",
      },
    ]);
    const nfts = await c.erc1155.getAll();
    expect(nfts.length).to.eq(2);
    expect(nfts[0].metadata.name).to.eq("Custom NFT");
  });

  it("should detect feature: erc1155 signature mintable", async () => {
    const c = await sdk.getContract(editionContractAddress);
    const payload = {
      metadata: {
        name: "OUCH VOUCH",
      },
      to: samWallet.address, // Who will receive the NFT (or AddressZero for anyone)
      price: 0.5, // the price to pay for minting
      currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
      royaltyBps: 100, // custom royalty fees for this NFT (in bps)
      quantity: "1",
    };

    const goodPayload = await c.erc1155.signature.generate(payload);

    const valid = await c.erc1155.signature.verify(goodPayload);
    assert.isTrue(valid, "This voucher should be valid");

    const tx = await c.erc1155.signature.mint(goodPayload);
    // Better way to do this?
    expect(tx.id.toNumber()).to.eq(0);
  });

  it("should detect feature: erc20 signature mintable", async () => {
    const c = await sdk.getContractFromAbi(
      tokenContractAddress,
      TokenERC20__factory.abi,
    );

    const meta: PayloadToSign20 = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      quantity: 50,
      price: "0.2",
      to: samWallet.address,
      primarySaleRecipient: adminWallet.address,
    };

    const input = [
      {
        ...meta,
        quantity: 1,
      },
      {
        ...meta,
        quantity: 2,
      },
      {
        ...meta,
        quantity: 3,
      },
    ];

    const batch = await c.erc20.signature.generateBatch(input);

    for (const b of batch) {
      await c.erc20.signature.mint(b);
    }
    const balance = await c.erc20.balanceOf(samWallet.address);
    expect(balance.displayValue).to.eq("6.0");
  });

  it("should detect feature: erc721 signature mintable", async () => {
    const c = await sdk.getContractFromAbi(
      nftContractAddress,
      TokenERC721__factory.abi,
    );

    const payload = {
      metadata: {
        name: "OUCH VOUCH",
      },
      to: samWallet.address, // Who will receive the NFT (or AddressZero for anyone)
      price: 0.5, // the price to pay for minting
      currencyAddress: NATIVE_TOKEN_ADDRESS, // the currency to pay with
      royaltyBps: 100, // custom royalty fees for this NFT (in bps)
      quantity: "1",
    };

    const goodPayload: SignedPayload721WithQuantitySignature =
      await c.erc721.signature.generate(payload);

    const valid = await c.erc721.signature.verify(goodPayload);
    assert.isTrue(valid, "This voucher should be valid");

    const tx = await c.erc721.signature.mint(goodPayload);
    // Better way to do this?
    expect(tx.id.toNumber()).to.eq(0);
  });
});
