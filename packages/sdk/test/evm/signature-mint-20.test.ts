import {
  NATIVE_TOKEN_ADDRESS,
  PayloadToSign20,
  SignedPayload20,
  Token,
} from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";

describe("Token sig minting", async () => {
  let contract: Token;
  let customTokenContract: Token;
  let tokenAddress: string;

  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  let meta: PayloadToSign20;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    contract = await sdk.getToken(
      await sdk.deployer.deployToken({
        name: "Token sigmint",
        symbol: "TSIG",
        primary_sale_recipient: adminWallet.address,
      }),
    );

    meta = {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      quantity: 50,
      price: "0.2",
      to: samWallet.address,
      primarySaleRecipient: adminWallet.address,
    };

    customTokenContract = await sdk.getToken(
      await sdk.deployer.deployToken({
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
    let goodPayload: SignedPayload20;
    let badPayload: SignedPayload20;

    beforeEach(async () => {
      goodPayload = await contract.signature.generate(meta);
      badPayload = await contract.signature.generate(meta);
      badPayload.payload.price = "0";
    });

    it("should generate a valid signature", async () => {
      const valid = await contract.signature.verify(goodPayload);
      assert.isTrue(valid, "This voucher should be valid");
    });

    it("should reject invalid signatures", async () => {
      const invalid = await contract.signature.verify(badPayload);
      assert.isFalse(
        invalid,
        "This voucher should be invalid because the signature is invalid",
      );
    });

    it("should reject invalid vouchers", async () => {
      goodPayload.payload.price = "0";
      const invalidModified = await contract.signature.verify(goodPayload);
      assert.isFalse(
        invalidModified,
        "This voucher should be invalid because the price was changed",
      );
    });

    it("should generate a valid batch of signatures", async () => {
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
      const batch = await contract.signature.generateBatch(input);

      for (const [, v] of batch.entries()) {
        await contract.signature.mint(v);
      }
      const balance = await contract.balanceOf(samWallet.address);
      expect(balance.displayValue).to.eq("6.0");
    });
  });

  describe("Claiming", async () => {
    it("should allow batch minting", async () => {
      const payloads = [] as PayloadToSign20[];
      const freeMint = {
        currencyAddress: NATIVE_TOKEN_ADDRESS,
        price: 0,
        quantity: 1,
        to: samWallet.address,
      };
      for (let i = 0; i < 10; i++) {
        payloads.push(freeMint);
      }
      const batch = await Promise.all(
        payloads.map(async (p) => await contract.signature.generate(p)),
      );
      await sdk.updateSignerOrProvider(samWallet);
      await contract.signature.mintBatch(batch);
      const balance = await contract.balanceOf(samWallet.address);
      expect(balance.displayValue).to.eq("10.0");
    });

    it("should mint the right custom token price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await contract.signature.generate({
        to: samWallet.address,
        price: 1,
        quantity: 10,
        currencyAddress: tokenAddress,
      });
      await sdk.updateSignerOrProvider(samWallet);
      await contract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });

    it("should mint the right native price", async () => {
      const oldBalance = await samWallet.getBalance();
      const payload = await contract.signature.generate({
        to: samWallet.address,
        price: 1,
        quantity: 0.23,
      });
      await sdk.updateSignerOrProvider(samWallet);
      await contract.signature.mint(payload);
      const newBalance = await samWallet.getBalance();
      assert(
        oldBalance.sub(newBalance).gte(BigNumber.from(1)),
        "balance doesn't match",
      );
    });
  });
});
