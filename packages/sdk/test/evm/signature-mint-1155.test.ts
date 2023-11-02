import {
  Edition,
  EditionInitializer,
  NATIVE_TOKEN_ADDRESS,
  PayloadToSign1155,
  SignedPayload1155,
  Token,
  TokenInitializer,
} from "../../src/evm";
import { sdk, signers, storage } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";

describe("Edition sig minting", async () => {
  let editionContract: Edition;
  let customTokenContract: Token;
  let tokenAddress: string;

  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  let meta: PayloadToSign1155;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    editionContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
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
      },
      price: "1",
      quantity: 1,
      to: samWallet.address,
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
    let goodPayload: SignedPayload1155;
    let badPayload: SignedPayload1155;

    beforeEach(async () => {
      goodPayload = await editionContract.signature.generate(meta);
      badPayload = await editionContract.signature.generate(meta);
      badPayload.payload.price = "0";
    });

    it("should generate a valid signature", async () => {
      const valid = await editionContract.signature.verify(goodPayload);
      assert.isTrue(valid, "This voucher should be valid");
    });

    it("should reject invalid signatures", async () => {
      const invalid = await editionContract.signature.verify(badPayload);
      assert.isFalse(
        invalid,
        "This voucher should be invalid because the signature is invalid",
      );
    });

    it("should reject invalid vouchers", async () => {
      goodPayload.payload.price = "0";
      const invalidModified =
        await editionContract.signature.verify(goodPayload);
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
      const batch = await editionContract.signature.generateBatch(input);

      for (let i = 0; i < batch.length; i++) {
        const entry = batch[i];
        const tx = await editionContract.signature.mint(entry);
        const mintedId = (await editionContract.get(tx.id)).metadata.id;
        const nft = await editionContract.get(mintedId);
        assert.equal(input[i].metadata.name, nft.metadata.name);
      }
    });
  });

  describe("Claiming", async () => {
    let v1: SignedPayload1155, v2: SignedPayload1155;

    beforeEach(async () => {
      v1 = await editionContract.signature.generate(meta);
      v2 = await editionContract.signature.generate(meta);
    });

    it("should allow batch minting", async () => {
      const payloads: PayloadToSign1155[] = [];
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
      const batch = await editionContract.signature.generateBatch(payloads);

      await sdk.updateSignerOrProvider(samWallet);
      const tx = await editionContract.signature.mintBatch(batch);
      expect(tx.length).to.eq(10);
      expect(tx[0].id.toNumber()).to.eq(0);
      expect(tx[3].id.toNumber()).to.eq(3);
    });

    it("should mint with URI", async () => {
      const uri = await storage.upload({
        name: "Test1",
      });
      const toSign = {
        to: adminWallet.address,
        metadata: uri,
        quantity: 10,
      };
      const payload = await editionContract.signature.generate(toSign);
      const tx = await editionContract.signature.mint(payload);
      const nft = await editionContract.get(tx.id);
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
        quantity: 10,
      };
      const toSign2 = {
        to: samWallet.address,
        metadata: uri2,
        quantity: 10,
      };
      const payloads = await editionContract.signature.generateBatch([
        toSign1,
        toSign2,
      ]);
      const tx = await editionContract.signature.mintBatch(payloads);
      const nft1 = await editionContract.get(tx[0].id);
      assert.equal(nft1.metadata.name, "Test1");
      const nft2 = await editionContract.get(tx[1].id);
      assert.equal(nft2.metadata.name, "Test2");
    });

    it("should allow a valid voucher to mint", async () => {
      await sdk.updateSignerOrProvider(samWallet);
      const tx = await editionContract.signature.mint(v1);
      const newId = (await editionContract.get(tx.id)).metadata.id;
      assert.equal(newId.toString(), "0");

      await sdk.updateSignerOrProvider(samWallet);
      const tx2 = await editionContract.signature.mint(v2);
      const newId2 = (await editionContract.get(tx2.id)).metadata.id;
      assert.equal(newId2.toString(), "1");
    });

    it("should mint the right metadata", async () => {
      const tx = await editionContract.signature.mint(v1);
      const nft = await editionContract.get(tx.id);
      assert.equal(nft.metadata.name, (meta.metadata as any)?.name);
    });

    it("should mint additional supply", async () => {
      const tx = await editionContract.signature.mint(v1);
      const additional = await editionContract.signature.generateFromTokenId({
        to: samWallet.address,
        tokenId: tx.id,
        quantity: 100,
      });
      await editionContract.signature.mint(additional);
      const nft = await editionContract.get(tx.id);
      expect(nft.supply).to.eq("101");
    });

    it("should mint additional supply of one tokenId", async () => {
      const oldBalance = await editionContract.balanceOf(
        samWallet.address,
        "0",
      );
      await editionContract.mint({
        metadata: { name: "test" },
        supply: 0,
      });
      const payload = await editionContract.signature.generateFromTokenId({
        to: samWallet.address,
        tokenId: "0",
        quantity: "1",
        metadata: "",
      });
      sdk.updateSignerOrProvider(samWallet);
      await editionContract.signature.mint(payload);
      const newBalance = await editionContract.balanceOf(
        samWallet.address,
        "0",
      );
      assert(newBalance.gt(oldBalance), "balance doesn't match");
    });

    it("should mint the right custom token price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await editionContract.signature.generate({
        to: samWallet.address,
        price: 1,
        currencyAddress: tokenAddress,
        metadata: {
          name: "custom token test",
        },
        quantity: 1,
        mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
        mintStartTime: new Date(),
      });
      await sdk.updateSignerOrProvider(samWallet);
      await editionContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await editionContract.signature.generate({
        to: samWallet.address,
        price: 1,
        metadata: {
          name: "native token test",
        },
        quantity: 1,
        mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
        mintStartTime: new Date(),
      });
      await sdk.updateSignerOrProvider(samWallet);
      await editionContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price with multiple tokens", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await editionContract.signature.generate({
        to: samWallet.address,
        price: 1,
        metadata: {
          name: "native token test with quantity",
        },
        quantity: 2,
        mintEndTime: new Date(Date.now() + 60 * 60 * 24 * 1000 * 1000),
        mintStartTime: new Date(),
      });
      await sdk.updateSignerOrProvider(samWallet);
      await editionContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(2)),
        "balance doesn't match",
      );
    });
  });
});
