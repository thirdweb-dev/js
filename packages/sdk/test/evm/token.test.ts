import { Token, TokenInitializer, TokenMintInput } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ethers } from "ethers";

//

describe("Token Contract", async () => {
  let currencyContract: Token;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployBuiltInContract(
      TokenInitializer.contractType,
      {
        name: `Testing token from SDK`,
        symbol: `TEST`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: adminWallet.address,
      },
    );
    currencyContract = await sdk.getToken(address);
  });

  it("should mint tokens", async () => {
    await currencyContract.mint("20");
    assert.deepEqual(
      (await currencyContract.totalSupply()).value,
      ethers.utils.parseEther("20"),
      `Wrong supply`,
    );
    assert.deepEqual(
      (await currencyContract.balanceOf(adminWallet.address)).value,
      ethers.utils.parseEther("20"),
      `Wrong balance`,
    );
  });

  it("should transfer tokens", async () => {
    await currencyContract.mint(20.2);
    await currencyContract.transfer(samWallet.address, 10.1);
    assert.deepEqual(
      (await currencyContract.balanceOf(adminWallet.address)).value,
      ethers.utils.parseEther("10.1"),
      `Wrong balance`,
    );
    assert.deepEqual(
      (await currencyContract.balanceOf(samWallet.address)).value,
      ethers.utils.parseEther("10.1"),
      `Wrong balance`,
    );
  });

  it("should list current holders", async () => {
    await currencyContract.mint(20);
    await currencyContract.transfer(samWallet.address, "10");
    await currencyContract.transfer(bobWallet.address, "5");
    sdk.updateSignerOrProvider(samWallet);
    await currencyContract.transfer(bobWallet.address, "3");

    const holders = await currencyContract.history.getAllHolderBalances();
    expect(holders.length).to.eq(3);
    expect(
      holders.find((h) => h.holder === adminWallet.address)?.balance
        .displayValue,
    ).to.eq("5.0");
    expect(
      holders.find((h) => h.holder === samWallet.address)?.balance.displayValue,
    ).to.eq("7.0");
    expect(
      holders.find((h) => h.holder === bobWallet.address)?.balance.displayValue,
    ).to.eq("8.0");
  });

  it("should burn tokens", async () => {
    await currencyContract.mint(20);
    assert.deepEqual(
      (await currencyContract.balanceOf(adminWallet.address)).value,
      ethers.utils.parseEther("20"),
      `Wrong balance`,
    );
    await currencyContract.burn(10);
    assert.deepEqual(
      (await currencyContract.balanceOf(adminWallet.address)).value,
      ethers.utils.parseEther("10"),
      `Wrong balance`,
    );
  });

  it("should mint a batch of tokens to the correct wallets", async () => {
    const batch: TokenMintInput[] = [
      {
        toAddress: bobWallet.address,
        amount: 10.5,
      },
      {
        toAddress: samWallet.address,
        amount: 10.5,
      },
    ];

    await currencyContract.mintBatchTo(batch);

    for (const b of batch) {
      const expectedBalance = ethers.utils.parseUnits("10.5");
      const actualBalance = (await currencyContract.balanceOf(b.toAddress))
        .value;

      assert.deepEqual(
        actualBalance,
        expectedBalance,
        `Wallet balance should increase by ${b.amount}`,
      );
    }
  });

  it("should transfer a batch of tokens to the correct wallets", async () => {
    const batch: TokenMintInput[] = [
      {
        toAddress: bobWallet.address,
        amount: 10,
      },
      {
        toAddress: samWallet.address,
        amount: 10,
      },
    ];
    await currencyContract.mint(20);
    await currencyContract.transferBatch(batch);

    for (const b of batch) {
      const expectedBalance = ethers.utils.parseEther("10");
      const actualBalance = (await currencyContract.balanceOf(b.toAddress))
        .value;

      assert.deepEqual(
        actualBalance,
        expectedBalance,
        `Wallet balance should increase by ${b.amount}`,
      );
    }
  });
});
