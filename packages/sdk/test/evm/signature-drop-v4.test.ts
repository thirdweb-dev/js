import { NFTMetadataInput } from "../../src/core/schema/nft";
import {
  NATIVE_TOKEN_ADDRESS,
  PayloadToSign721withQuantity,
  SignatureDrop,
  SignatureDropInitializer,
  SignedPayload721WithQuantitySignature,
  Token,
  TokenInitializer,
} from "../../src/evm";
import { expectError, sdk, signers, storage } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

// TODO: Re-enable when size issue is fixed
describe.skip("Signature drop tests (v4)", async () => {
  let signatureDropContract: SignatureDrop;
  let customTokenContract: Token;
  let tokenAddress: string;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    abbyWallet: SignerWithAddress,
    bobWallet: SignerWithAddress,
    w1: SignerWithAddress,
    w2: SignerWithAddress,
    w3: SignerWithAddress,
    w4: SignerWithAddress;

  let meta: PayloadToSign721withQuantity;

  before(() => {
    [adminWallet, samWallet, bobWallet, abbyWallet, w1, w2, w3, w4] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    signatureDropContract = await sdk.getSignatureDrop(
      await sdk.deployer.deployBuiltInContract(
        SignatureDropInitializer.contractType,
        {
          name: "OUCH VOUCH",
          symbol: "VOUCH",
          primary_sale_recipient: adminWallet.address,
          seller_fee_basis_points: 0,
        },
        "4",
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
    let goodPayload: SignedPayload721WithQuantitySignature;
    let badPayload: SignedPayload721WithQuantitySignature;

    beforeEach(async () => {
      goodPayload = await signatureDropContract.signature.generate(meta);
      badPayload = await signatureDropContract.signature.generate(meta);
      badPayload.payload.price = "0";
    });

    it("should generate a valid signature", async () => {
      const valid = await signatureDropContract.signature.verify(goodPayload);
      assert.isTrue(valid, "This voucher should be valid");
    });

    it("should reject invalid signatures", async () => {
      const invalid = await signatureDropContract.signature.verify(badPayload);
      assert.isFalse(
        invalid,
        "This voucher should be invalid because the signature is invalid",
      );
    });

    it("should reject invalid vouchers", async () => {
      goodPayload.payload.price = "0";
      const invalidModified = await signatureDropContract.signature.verify(
        goodPayload,
      );
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

      await signatureDropContract.createBatch([
        {
          name: "OUCH VOUCH 0",
        },
        {
          name: "OUCH VOUCH 1",
        },
        {
          name: "OUCH VOUCH 2",
        },
      ]);

      const batch = await signatureDropContract.signature.generateBatch(input);

      for (let i = 0; i < batch.length; i++) {
        const entry = batch[i];
        const tx = await signatureDropContract.signature.mint(entry);
        const mintedId = (await signatureDropContract.get(tx.id)).metadata.id;
        const nft = await signatureDropContract.get(mintedId);
        assert.equal(input[i].metadata.name, nft.metadata.name);
      }
    });
  });

  describe("Claiming", async () => {
    let v1: SignedPayload721WithQuantitySignature,
      v2: SignedPayload721WithQuantitySignature;

    beforeEach(async () => {
      v1 = await signatureDropContract.signature.generate(meta);
      v2 = await signatureDropContract.signature.generate(meta);

      await signatureDropContract.createBatch([
        {
          name: "Test1",
        },
        {
          name: "Test2",
        },
      ]);
    });

    it("comprehensive test", async () => {
      const metadata: NFTMetadataInput[] = [];
      for (let i = 0; i < 10; i++) {
        metadata.push({ name: `test${i}`, description: `desc${i}` });
      }
      await signatureDropContract.createBatch(metadata);
      // claiming with default conditions
      await signatureDropContract.claimConditions.set([{}]);
      await signatureDropContract.claim(1);
      // claiming with max supply
      await signatureDropContract.claimConditions.set([
        {
          maxClaimableSupply: 1,
        },
      ]);
      try {
        await signatureDropContract.claim(2);
        expect.fail("should not be able to claim 2 - maxSupply");
      } catch (e) {
        expectError(e, "exceeds max supply");
      }
      await signatureDropContract.claim(1);
      // claiming with max per wallet
      await signatureDropContract.claimConditions.set([
        {
          maxClaimablePerWallet: 1,
        },
      ]);
      try {
        await signatureDropContract.claim(2);
        expect.fail("should not be able to claim 2 - maxClaimablePerWallet");
      } catch (e) {
        expectError(e, "Invalid quantity");
      }
      await signatureDropContract.claim(1);
      expect((await signatureDropContract.totalClaimedSupply()).toString()).eq(
        "3",
      );
    });

    it("comprehensive test with allowlist", async () => {
      const metadata: NFTMetadataInput[] = [];
      for (let i = 0; i < 10; i++) {
        metadata.push({ name: `test${i}`, description: `desc${i}` });
      }
      await signatureDropContract.createBatch(metadata);
      // claiming with default conditions
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [adminWallet.address],
        },
      ]);
      try {
        sdk.updateSignerOrProvider(bobWallet);
        await signatureDropContract.claim(1);
        expect.fail("should not be able to claim - not in allowlist");
      } catch (e) {
        expectError(e, "No claim found");
      }
      sdk.updateSignerOrProvider(adminWallet);
      await signatureDropContract.claim(1);

      // claiming with max supply
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [adminWallet.address],
          maxClaimableSupply: 1,
        },
      ]);
      try {
        await signatureDropContract.claim(2);
        expect.fail("should not be able to claim - maxClaimableSupply");
      } catch (e) {
        expectError(e, "exceeds max supply");
      }
      await signatureDropContract.claim(1);
      // claiming with max per wallet
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [adminWallet.address],
          maxClaimablePerWallet: 1,
        },
      ]);
      try {
        await signatureDropContract.claim(2);
        expect.fail("should not be able to claim - maxClaimablePerWallet");
      } catch (e) {
        expectError(e, "Invalid quantity");
      }
      await signatureDropContract.claim(1);
      // claiming with max per wallet in snapshot
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [{ address: adminWallet.address, maxClaimable: 1 }],
          maxClaimablePerWallet: 0,
        },
      ]);
      try {
        await signatureDropContract.claim(2);
        expect.fail("should not be able to claim - proof maxClaimable");
      } catch (e) {
        expectError(e, "Invalid qty proof");
      }
      await signatureDropContract.claim(1);
      try {
        await signatureDropContract.claim(1);
        expect.fail("should not be able to claim - proof used");
      } catch (e) {
        expectError(e, "proof claimed");
      }
    });

    it("should mint with URI", async () => {
      const uri = await storage.upload({
        name: "Test1",
      });
      const toSign = {
        to: adminWallet.address,
        metadata: uri,
        quantity: 1,
      };
      const payload = await signatureDropContract.signature.generate(toSign);
      const tx = await signatureDropContract.signature.mint(payload);
      const nft = await signatureDropContract.get(tx.id);
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
        to: adminWallet.address,
        metadata: uri1,
        quantity: 1,
      };
      const toSign2 = {
        to: adminWallet.address,
        metadata: uri2,
        quantity: 1,
      };
      const payloads = await signatureDropContract.signature.generateBatch([
        toSign1,
        toSign2,
      ]);
      const tx = await signatureDropContract.signature.mintBatch(payloads);
      const nft1 = await signatureDropContract.get(tx[0].id);
      assert.equal(nft1.metadata.name, "Test1");
      const nft2 = await signatureDropContract.get(tx[1].id);
      assert.equal(nft2.metadata.name, "Test2");
    });

    it("should allow a valid voucher to mint", async () => {
      await sdk.updateSignerOrProvider(samWallet);
      const tx = await signatureDropContract.signature.mint(v1);
      const newId = (await signatureDropContract.get(tx.id)).metadata.id;
      assert.equal(newId.toString(), "0");

      await sdk.updateSignerOrProvider(samWallet);
      const tx2 = await signatureDropContract.signature.mint(v2);
      const newId2 = (await signatureDropContract.get(tx2.id)).metadata.id;
      assert.equal(newId2.toString(), "1");
    });

    it("should mint the right metadata", async () => {
      const tx = await signatureDropContract.signature.mint(v1);
      const nft = await signatureDropContract.get(tx.id);
      assert.equal(nft.metadata.name, "Test1");

      const tx2 = await signatureDropContract.signature.mint(v2);
      const nft2 = await signatureDropContract.get(tx2.id);
      assert.equal(nft2.metadata.name, "Test2");
    });

    it("should mint the right custom token price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await signatureDropContract.signature.generate({
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
      await signatureDropContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await signatureDropContract.signature.generate({
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
      await signatureDropContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price with multiple tokens", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await signatureDropContract.signature.generate({
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
      await signatureDropContract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(2)),
        "balance doesn't match",
      );
    });
  });

  describe("Delay Reveal", () => {
    it("metadata should reveal correctly", async () => {
      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [{ name: "NFT #1" }, { name: "NFT #2" }],
        "my secret password",
      );

      expect((await signatureDropContract.get("0")).metadata.name).to.be.equal(
        "Placeholder #1",
      );

      await signatureDropContract.revealer.reveal(0, "my secret password");

      expect((await signatureDropContract.get("0")).metadata.name).to.be.equal(
        "NFT #1",
      );
    });

    it("different reveal order and should return correct unreveal list", async () => {
      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [
          {
            name: "NFT #1",
          },
          {
            name: "NFT #2",
          },
        ],
        "my secret key",
      );

      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #2",
        },
        [
          {
            name: "NFT #3",
          },
          {
            name: "NFT #4",
          },
        ],
        "my secret key",
      );

      await signatureDropContract.createBatch([
        {
          name: "NFT #00",
        },
        {
          name: "NFT #01",
        },
      ]);

      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #3",
        },
        [
          {
            name: "NFT #5",
          },
          {
            name: "NFT #6",
          },
          {
            name: "NFT #7",
          },
        ],
        "my secret key",
      );

      let unrevealList =
        await signatureDropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(3);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(0);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #1",
      );
      expect(unrevealList[1].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[1].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
      // skipped 2 because it is a revealed batch
      expect(unrevealList[2].batchId.toNumber()).to.be.equal(3);
      expect(unrevealList[2].placeholderMetadata.name).to.be.equal(
        "Placeholder #3",
      );

      await signatureDropContract.revealer.reveal(
        unrevealList[0].batchId,
        "my secret key",
      );

      unrevealList = await signatureDropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(2);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
      expect(unrevealList[1].batchId.toNumber()).to.be.equal(3);
      expect(unrevealList[1].placeholderMetadata.name).to.be.equal(
        "Placeholder #3",
      );

      await signatureDropContract.revealer.reveal(
        unrevealList[unrevealList.length - 1].batchId,
        "my secret key",
      );

      unrevealList = await signatureDropContract.revealer.getBatchesToReveal();
      expect(unrevealList.length).to.be.equal(1);
      expect(unrevealList[0].batchId.toNumber()).to.be.equal(1);
      expect(unrevealList[0].placeholderMetadata.name).to.be.equal(
        "Placeholder #2",
      );
    });

    it("should not be able to re-used published password for next batch", async () => {
      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #1",
        },
        [{ name: "NFT #1" }, { name: "NFT #2" }],
        "my secret password",
      );
      await signatureDropContract.revealer.createDelayedRevealBatch(
        {
          name: "Placeholder #2",
        },
        [{ name: "NFT #3" }, { name: "NFT #4" }],
        "my secret password",
      );
      await signatureDropContract.revealer.reveal(0, "my secret password");
      const transactions =
        (await adminWallet.provider?.getBlockWithTransactions("latest"))
          ?.transactions || [];

      const { _index, _key } = signatureDropContract.encoder.decode(
        "reveal",
        transactions[0].data,
      );

      // re-using broadcasted _key to decode :)
      try {
        await signatureDropContract.revealer.reveal(_index.add(1), _key);
        assert.fail("should not be able to re-used published password");
      } catch (e) {
        expect((e as Error).message).to.be.equal("invalid password");
      }

      // original password should work
      await signatureDropContract.revealer.reveal(1, "my secret password");
    });
  });

  describe("Claim Conditions", () => {
    it("should allow a snapshot to be set", async () => {
      await signatureDropContract.createBatch([
        { name: "test1", description: "test" },
        { name: "test2", description: "test" },
      ]);

      await signatureDropContract.claimConditions.set([
        {
          snapshot: [samWallet.address],
        },
      ]);
      const conditions = await signatureDropContract.claimConditions.getActive({
        withAllowList: true,
      });
      invariant(conditions.snapshot);
      expect(conditions.snapshot[0].address).to.eq(samWallet.address);
    });

    it("should remove merkles from the metadata when claim conditions are removed", async () => {
      await signatureDropContract.claimConditions.set([
        {
          startTime: new Date(),
          waitInSeconds: 10,
          snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        },
      ]);

      const metadata = await signatureDropContract.metadata.get();
      const merkles = metadata.merkle;
      expect(merkles).have.property(
        "0xb1a60ad68b77609a455696695fbdd02b850d03ec285e7fe1f4c4093797457b24",
      );

      const roots = await signatureDropContract.claimConditions.getActive();
      expect(roots.merkleRootHash.length > 0);

      await signatureDropContract.claimConditions.set([{}]);
      const newMetadata = await signatureDropContract.metadata.get();
      const newMerkles = newMetadata.merkle;
      expect(JSON.stringify(newMerkles)).to.eq("{}");
    });

    it("allow all addresses in the merkle tree to claim", async () => {
      const testWallets: SignerWithAddress[] = [
        bobWallet,
        samWallet,
        abbyWallet,
        w1,
        w2,
        w3,
        w4,
      ];
      const members = testWallets.map((w, i) =>
        i % 3 === 0
          ? w.address.toLowerCase()
          : i % 3 === 1
          ? w.address.toUpperCase().replace("0X", "0x")
          : w.address,
      );

      await signatureDropContract.claimConditions.set([
        {
          snapshot: members,
        },
      ]);
      const metadata = [] as NFTMetadataInput[];
      for (let i = 0; i < 10; i++) {
        metadata.push({
          name: `test ${i}`,
        });
      }
      await signatureDropContract.createBatch(metadata);

      /**
       * Claiming 1 token with proofs: 0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9,0xb1a5bda84b83f7f014abcf0cf69cab5a4de1c3ececa8123a5e4aaacb01f63f83
       */

      for (const member of testWallets) {
        await sdk.updateSignerOrProvider(member);
        await signatureDropContract.claim(1);
      }
    });

    it("allow one address in the merkle tree to claim", async () => {
      const testWallets: SignerWithAddress[] = [bobWallet];
      const members = testWallets.map((w) => w.address);

      await signatureDropContract.claimConditions.set([
        {
          snapshot: members,
        },
      ]);

      const metadata = [] as NFTMetadataInput[];
      for (let i = 0; i < 2; i++) {
        metadata.push({
          name: `test ${i}`,
        });
      }
      await signatureDropContract.createBatch(metadata);

      /**
       * Claiming 1 token with proofs: 0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9,0xb1a5bda84b83f7f014abcf0cf69cab5a4de1c3ececa8123a5e4aaacb01f63f83
       */

      for (const member of testWallets) {
        await sdk.updateSignerOrProvider(member);
        await signatureDropContract.claim(1);
      }

      try {
        await sdk.updateSignerOrProvider(samWallet);
        await signatureDropContract.claim(1);
        assert.fail("should have thrown");
      } catch (e) {
        // expected
      }
    });

    it("should query total claimed supply even after claim reset", async () => {
      const metadatas = [] as NFTMetadataInput[];
      for (let i = 0; i < 100; i++) {
        metadatas.push({
          name: `test ${i}`,
        });
      }
      await signatureDropContract.createBatch(metadatas);
      await signatureDropContract.claimConditions.set([
        {
          maxClaimableSupply: 10,
        },
      ]);
      await signatureDropContract.claim(5);
      await signatureDropContract.claimConditions.set(
        [
          {
            maxClaimableSupply: 10,
          },
        ],
        true,
      );
      await signatureDropContract.claim(10);
      expect(
        (await signatureDropContract.totalClaimedSupply()).toNumber(),
      ).to.eq(15);
      expect((await signatureDropContract.getAllClaimed()).length).to.eq(15);
      expect(
        (await signatureDropContract.totalUnclaimedSupply()).toNumber(),
      ).to.eq(85);
      expect((await signatureDropContract.getAllUnclaimed()).length).to.eq(85);
    });

    it("should correctly upload metadata for each nft", async () => {
      const metadatas = [] as NFTMetadataInput[];
      for (let i = 0; i < 100; i++) {
        metadatas.push({
          name: `test ${i}`,
        });
      }
      await signatureDropContract.createBatch(metadatas);
      const all = await signatureDropContract.getAll();
      let owned = await signatureDropContract.getOwned();
      expect(all.length).to.eq(100);
      expect(owned.length).to.eq(0);
      await signatureDropContract.claimConditions.set([{}]);
      await signatureDropContract.claim(1);
      owned = await signatureDropContract.getOwned();
      expect(owned.length).to.eq(1);
      expect(owned[0].owner).to.eq(adminWallet.address);
      const claimed = await signatureDropContract.totalClaimedSupply();
      const unclaimed = await signatureDropContract.totalUnclaimedSupply();
      expect(claimed.toNumber()).to.eq(1);
      expect(unclaimed.toNumber()).to.eq(99);
    });

    it("should correctly update total supply after burning", async () => {
      const metadatas = [] as NFTMetadataInput[];
      for (let i = 0; i < 20; i++) {
        metadatas.push({
          name: `test ${i}`,
        });
      }
      await signatureDropContract.createBatch(metadatas);
      await signatureDropContract.claimConditions.set([{}]);
      await signatureDropContract.claim(10);
      const ts = await signatureDropContract.totalSupply();
      expect(ts.toNumber()).to.eq(20);
      await signatureDropContract.burn(0);
      const ts2 = await signatureDropContract.totalSupply();
      expect(ts2.toNumber()).to.eq(20);
    });

    it("should not allow claiming to someone not in the merkle tree", async () => {
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [bobWallet.address, samWallet.address, abbyWallet.address],
        },
      ]);
      await signatureDropContract.createBatch([
        { name: "name", description: "description" },
      ]);

      await sdk.updateSignerOrProvider(w1);
      try {
        await signatureDropContract.claim(1);
      } catch (err: any) {
        expect(err).to.have.property(
          "message",
          "No claim found for this address",
          "",
        );
        return;
      }
      assert.fail("should not reach this point, claim should have failed");
    });

    it("should allow claims with default settings", async () => {
      await signatureDropContract.createBatch([
        { name: "name", description: "description" },
      ]);
      await signatureDropContract.claimConditions.set([{}]);
      await signatureDropContract.claim(1);
    });

    it("should allow setting max claims per wallet", async () => {
      await signatureDropContract.createBatch([
        { name: "name", description: "description" },
        { name: "name2", description: "description" },
        { name: "name3", description: "description" },
        { name: "name4", description: "description" },
      ]);
      await signatureDropContract.claimConditions.set([
        {
          snapshot: [
            { address: w1.address, maxClaimable: 2 },
            { address: w2.address, maxClaimable: 1 },
          ],
        },
      ]);
      await sdk.updateSignerOrProvider(w1);
      const tx = await signatureDropContract.claim(2);
      expect(tx.length).to.eq(2);
      try {
        await sdk.updateSignerOrProvider(w2);
        await signatureDropContract.claim(2);
      } catch (e) {
        expectError(e, "Invalid qty proof");
      }
    });

    it("should return the newly claimed token", async () => {
      await signatureDropContract.claimConditions.set([{}]);
      await signatureDropContract.createBatch([
        {
          name: "test 0",
        },
        {
          name: "test 1",
        },
        {
          name: "test 2",
        },
      ]);

      try {
        await signatureDropContract.createBatch([
          {
            name: "test 0",
          },
          {
            name: "test 1",
          },
          {
            name: "test 2",
          },
        ]);
      } catch (err) {
        expect(err).to.have.property("message", "Batch already created!", "");
      }

      const _token = await signatureDropContract.claim(2);
      assert.lengthOf(_token, 2);
    });
  });
});
