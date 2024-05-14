import {
  Edition,
  EditionInitializer,
  Multiwrap,
  NFTCollection,
  NFTCollectionInitializer,
  Token,
  TokenInitializer,
} from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Multiwrap Contract", async () => {
  let multiwrapContract: Multiwrap;
  let nftContract: NFTCollection;
  let editionContract: Edition;
  let tokenContract: Token;
  let tokenContract2: Token;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployMultiwrap({
      name: `Testing multiwrap from SDK`,
      symbol: `TEST`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
    });
    multiwrapContract = await sdk.getMultiwrap(address);

    nftContract = await sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(
        NFTCollectionInitializer.contractType,
        {
          name: "TEST NFT",
          seller_fee_basis_points: 200,
          fee_recipient: adminWallet.address,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await nftContract.mintBatch([
      {
        name: "Test 0",
      },
      {
        name: "Test 1",
      },
      {
        name: "Test 2",
      },
      {
        name: "Test 3",
      },
    ]);

    // TODO should this be done inside wrap() ? might result in a ton of different transactions :/
    await nftContract.setApprovalForAll(multiwrapContract.getAddress(), true);

    editionContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
        {
          name: "TEST BUNDLE",
          seller_fee_basis_points: 100,
          primary_sale_recipient: adminWallet.address,
        },
      ),
    );
    await editionContract.mintBatch([
      {
        metadata: {
          name: "Test 0",
        },
        supply: 100,
      },
      {
        metadata: {
          name: "Test 1",
        },
        supply: 100,
      },
    ]);

    await editionContract.setApprovalForAll(
      multiwrapContract.getAddress(),
      true,
    );

    tokenContract = await sdk.getToken(
      await sdk.deployer.deployBuiltInContract(TokenInitializer.contractType, {
        name: "Test",
        symbol: "TEST",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await tokenContract.mintBatchTo([
      {
        toAddress: bobWallet.address,
        amount: 1000,
      },
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);

    await tokenContract.setAllowance(multiwrapContract.getAddress(), 1000);

    tokenContract2 = await sdk.getToken(
      await sdk.deployer.deployBuiltInContract(TokenInitializer.contractType, {
        name: "Test2",
        symbol: "TEST2",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await tokenContract2.mintBatchTo([
      {
        toAddress: bobWallet.address,
        amount: 1000,
      },
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);

    await tokenContract2.setAllowance(multiwrapContract.getAddress(), 1000);
  });

  it("should wrap erc20s", async () => {
    await multiwrapContract.wrap(
      {
        erc20Tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            quantity: 100.5,
          },
          {
            contractAddress: tokenContract2.getAddress(),
            quantity: "200.1",
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance = await tokenContract.balanceOf(adminWallet.address);
    const balance2 = await tokenContract2.balanceOf(adminWallet.address);
    expect(balance.displayValue).to.equal("899.5");
    expect(balance2.displayValue).to.equal("799.9");
  });

  it("should wrap erc721s", async () => {
    await multiwrapContract.wrap(
      {
        erc721Tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "2",
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance = await nftContract.balanceOf(adminWallet.address);
    expect(balance.toNumber()).to.eq(2);
  });

  it("should wrap erc1155s", async () => {
    await multiwrapContract.wrap(
      {
        erc1155Tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            quantity: 10,
          },
          {
            contractAddress: editionContract.getAddress(),
            tokenId: 1,
            quantity: 20,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance0 = await editionContract.balanceOf(adminWallet.address, 0);
    const balance1 = await editionContract.balanceOf(adminWallet.address, 1);
    expect(balance0.toNumber()).to.eq(90);
    expect(balance1.toNumber()).to.eq(80);
  });

  it("should wrap mixed tokens", async () => {
    await multiwrapContract.wrap(
      {
        erc20Tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            quantity: 100.5,
          },
        ],
        erc721Tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
        ],
        erc1155Tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            quantity: 10,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balanceT = await tokenContract.balanceOf(adminWallet.address);
    expect(balanceT.displayValue).to.equal("899.5");
    const balanceN = await nftContract.balanceOf(adminWallet.address);
    expect(balanceN.toNumber()).to.eq(3);
    const balanceE = await editionContract.balanceOf(adminWallet.address, 0);
    expect(balanceE.toNumber()).to.eq(90);
  });

  it("get wrapped contents", async () => {
    const tx = await multiwrapContract.wrap(
      {
        erc20Tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            quantity: 100.5,
          },
          {
            contractAddress: tokenContract2.getAddress(),
            quantity: 19.5,
          },
        ],
        erc721Tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
        ],
        erc1155Tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            quantity: 10,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const wrappedMeta = await tx.data();
    expect(wrappedMeta.metadata.name).to.equal("Wrapped token");
    const wrappedTokens = await multiwrapContract.getWrappedContents(tx.id);
    expect(wrappedTokens.erc20Tokens.length).to.eq(2);
    expect(wrappedTokens.erc20Tokens[0].contractAddress).to.eq(
      tokenContract.getAddress(),
    );
    expect(wrappedTokens.erc1155Tokens[0].quantity).to.eq("10");
  });

  it("unwrapped contents", async () => {
    const tx = await multiwrapContract.wrap(
      {
        erc20Tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            quantity: 100.5,
          },
        ],
        erc721Tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
        ],
        erc1155Tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            quantity: 10,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balanceT = await tokenContract.balanceOf(adminWallet.address);
    expect(balanceT.displayValue).to.equal("899.5");
    const balanceN = await nftContract.balanceOf(adminWallet.address);
    expect(balanceN.toNumber()).to.eq(3);
    const balanceE = await editionContract.balanceOf(adminWallet.address, 0);
    expect(balanceE.toNumber()).to.eq(90);

    const wrappedTokenId = tx.id;
    await multiwrapContract.unwrap(wrappedTokenId);

    const balanceT2 = await tokenContract.balanceOf(adminWallet.address);
    expect(balanceT2.displayValue).to.equal("1000.0");
    const balanceN2 = await nftContract.balanceOf(adminWallet.address);
    expect(balanceN2.toNumber()).to.eq(4);
    const balanceE2 = await editionContract.balanceOf(adminWallet.address, 0);
    expect(balanceE2.toNumber()).to.eq(100);
  });

  it("can list all wrapped tokens", async () => {
    await multiwrapContract.wrap(
      {
        erc20Tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            quantity: 100.5,
          },
        ],
      },
      {
        name: "Wrapped token 0",
      },
    );
    await multiwrapContract.wrap(
      {
        erc721Tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
        ],
      },
      {
        name: "Wrapped token 1",
      },
    );
    await multiwrapContract.wrap(
      {
        erc1155Tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            quantity: 10,
          },
        ],
      },
      {
        name: "Wrapped token 2",
      },
    );
    const all = await multiwrapContract.getAll();
    expect(all.length).to.eq(3);
    expect(all[0].metadata.name).to.eq("Wrapped token 0");
    expect(all[1].metadata.name).to.eq("Wrapped token 1");
  });
});
