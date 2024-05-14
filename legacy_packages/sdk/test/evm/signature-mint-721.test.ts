import {
  NATIVE_TOKEN_ADDRESS,
  NFTCollection,
  NFTCollectionInitializer,
  PayloadToSign721withQuantity,
  SignedPayload721WithQuantitySignature,
  Token,
  TokenInitializer,
} from "../../src/evm";
import { sdk, signers, storage } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";

describe("NFT sig minting", async () => {
  let nftContract: NFTCollection;
  let customTokenContract: Token;
  let tokenAddress: string;

  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  let meta: PayloadToSign721withQuantity;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    nftContract = await sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(
        NFTCollectionInitializer.contractType,
        {
          name: "OUCH VOUCH",
          symbol: "VOUCH",
          primary_sale_recipient: adminWallet.address,
          seller_fee_basis_points: 0,
        },
      ),
    );

    meta = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      metadata: {
        name: "OUCH VOUCH",
        background_color: "ff0000",
      },
      price: "1",
      to: samWallet.address,
      mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
      mintStartTime: new Date(),
    };

    customTokenContract = await sdk.getToken(
      await sdk.deployer.deployBuiltInContract(TokenInitializer.contractType, {
        name: "Test",
        symbol: "TEST",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await customTokenContract.mintBatchTo([
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);
    tokenAddress = customTokenContract.getAddress();
  });

  describe("Generating Signatures", () => {
    // let voucher: SignaturePayload;
    // let signature: string, badSignature: string;
    let goodPayload: SignedPayload721WithQuantitySignature;
    let badPayload: SignedPayload721WithQuantitySignature;

    beforeEach(async () => {
      goodPayload = await nftContract.signature.generate(meta);
      badPayload = await nftContract.signature.generate(meta);
      badPayload.payload.price = "0";
    });

    it("should generate a valid signature", async () => {
      const valid = await nftContract.signature.verify(goodPayload);
      assert.isTrue(valid, "This voucher should be valid");
    });

    it("should reject invalid signatures", async () => {
      const invalid = await nftContract.signature.verify(badPayload);
      assert.isFalse(
        invalid,
        "This voucher should be invalid because the signature is invalid",
      );
    });

    it("should reject invalid vouchers", async () => {
      goodPayload.payload.price = "0";
      const invalidModified = await nftContract.signature.verify(goodPayload);
      assert.isFalse(
        invalidModified,
        "This voucher should be invalid because the price was changed",
      );
    });

    it("should generate a valid batch of signatures", async () => {
      const input = [
        {
          ...meta,
          metadata: {
            name: "OUCH VOUCH 0",
          },
        },
        {
          ...meta,
          metadata: {
            name: "OUCH VOUCH 1",
          },
        },
        {
          ...meta,
          metadata: {
            name: "OUCH VOUCH 2",
          },
        },
      ];
      const batch = await nftContract.signature.generateBatch(input);

      for (const [i, v] of batch.entries()) {
        const tx = await nftContract.signature.mint(v);
        const mintedId = (await nftContract.get(tx.id)).metadata.id;
        const nft = await nftContract.get(mintedId);
        assert.equal(input[i].metadata.name, nft.metadata.name);
      }
    });
  });

  describe("Claiming", async () => {
    let v1: SignedPayload721WithQuantitySignature,
      v2: SignedPayload721WithQuantitySignature;

    beforeEach(async () => {
      v1 = await nftContract.signature.generate(meta);
      v2 = await nftContract.signature.generate(meta);
    });

    it("should allow batch minting", async () => {
      const payloads = [] as PayloadToSign721withQuantity[];
      const freeMint = {
        currencyAddress: NATIVE_TOKEN_ADDRESS,
        metadata: {
          name: "OUCH VOUCH",
        },
        price: 0,
        quantity: 1,
        to: samWallet.address,
      };
      for (let i = 0; i < 10; i++) {
        payloads.push(freeMint);
      }
      const batch = await Promise.all(
        payloads.map(async (p) => await nftContract.signature.generate(p)),
      );
      await sdk.updateSignerOrProvider(samWallet);
      const tx = await nftContract.signature.mintBatch(batch);
      expect(tx.length).to.eq(10);
      expect(tx[0].id.toNumber()).to.eq(0);
      expect(tx[3].id.toNumber()).to.eq(3);
    });

    it("should allow a valid voucher to mint", async () => {
      await sdk.updateSignerOrProvider(samWallet);
      const tx = await nftContract.signature.mint(v1);
      const newId = (await nftContract.get(tx.id)).metadata.id;
      assert.equal(newId.toString(), "0");

      await sdk.updateSignerOrProvider(samWallet);
      const tx2 = await nftContract.signature.mint(v2);
      const newId2 = (await nftContract.get(tx2.id)).metadata.id;
      assert.equal(newId2.toString(), "1");
    });

    it("should mint the right metadata", async () => {
      const tx = await nftContract.signature.mint(v1);
      const nft = await nftContract.get(tx.id);
      assert.equal(nft.metadata.name, "OUCH VOUCH");
    });

    it("should mint with URI", async () => {
      const uri = await storage.upload({
        name: "Test1",
      });
      const toSign = {
        to: samWallet.address,
        metadata: uri,
      };
      const payload = await nftContract.signature.generate(toSign);
      const tx = await nftContract.signature.mint(payload);
      const nft = await nftContract.get(tx.id);
      assert.equal(nft.metadata.name, "Test1");
    });

    it("should mint batch with URI", async () => {
      const uri1 = await storage.upload({
        name: "Test1",
      });
      const uri2 = await storage.upload({
        name: "Test2",
      });
      const toSign1 = {
        to: samWallet.address,
        metadata: uri1,
      };
      const toSign2 = {
        to: samWallet.address,
        metadata: uri2,
      };
      const payloads = await nftContract.signature.generateBatch([
        toSign1,
        toSign2,
      ]);
      const tx = await nftContract.signature.mintBatch(payloads);
      const nft1 = await nftContract.get(tx[0].id);
      assert.equal(nft1.metadata.name, "Test1");
      const nft2 = await nftContract.get(tx[1].id);
      assert.equal(nft2.metadata.name, "Test2");
    });

    it("should mint the right custom token price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await nftContract.signature.generate({
        to: samWallet.address,
        price: 1,
        currencyAddress: tokenAddress,
        metadata: {
          name: "custom token test",
        },
        mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
        mintStartTime: new Date(),
      });
      await sdk.updateSignerOrProvider(samWallet);
      await nftContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await nftContract.signature.generate({
        to: samWallet.address,
        price: 1,
        metadata: {
          name: "native token test",
        },
        mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
        mintStartTime: new Date(),
      });
      await sdk.updateSignerOrProvider(samWallet);
      await nftContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });
  });
});
