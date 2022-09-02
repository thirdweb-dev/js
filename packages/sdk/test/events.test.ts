import { ContractEvent, NFTDrop, NFTCollection } from "../src";
import { sdk, signers } from "./hooks";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, Wallet } from "ethers";

global.fetch = require("cross-fetch");

describe("Events", async () => {
  let dropContract: NFTDrop;
  let dropContract2: NFTDrop;
  let nftContract: NFTCollection;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    dropContract = sdk.getNFTDrop(
      await sdk.deployer.deployBuiltInContract(NFTDrop.contractType, {
        name: `Testing drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: AddressZero,
        seller_fee_basis_points: 500,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      }),
    );

    dropContract2 = sdk.getNFTDrop(
      await sdk.deployer.deployBuiltInContract(NFTDrop.contractType, {
        name: `Testing drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: AddressZero,
        seller_fee_basis_points: 500,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      }),
    );

    nftContract = sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(NFTCollection.contractType, {
        name: "NFT Contract",
        description: "Test NFT contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: AddressZero,
        seller_fee_basis_points: 1000,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      }),
    );
  });

  it("should emit Transaction events", async () => {
    let txStatus = "";
    dropContract.events.addTransactionListener((event) => {
      if (!txStatus) {
        expect(event.status).to.eq("submitted");
      } else if (txStatus === "submitted") {
        expect(event.status).to.eq("completed");
      }
      txStatus = event.status;
    });
    await dropContract.setApprovalForAll(ethers.constants.AddressZero, true);
    dropContract.events.removeAllListeners();
  });

  it("should emit Contract events", async () => {
    const events: ContractEvent[] = [];
    const remove = dropContract.events.addEventListener(
      "TokensLazyMinted",
      (event) => {
        events.push(event);
      },
    );
    await dropContract.createBatch([
      {
        name: "1",
      },
      {
        name: "2",
      },
    ]);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    remove();
    expect(events.length).to.be.gt(0);
    expect(events.map((e) => e.eventName)).to.include("TokensLazyMinted");
  });

  it("should emit all Contract events", async () => {
    const events: ContractEvent[] = [];
    const remove = dropContract2.events.listenToAllEvents((event) => {
      events.push(event);
    });
    await dropContract2.createBatch([
      {
        name: "1",
      },
      {
        name: "2",
      },
    ]);
    await dropContract2.claimConditions.set([{}]);
    await dropContract2.claim(1);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    remove();
    expect(events.length).to.be.gt(0);
    expect(events.map((e) => e.eventName)).to.include("TokensLazyMinted");
    expect(events.map((e) => e.eventName)).to.include("TokensClaimed");
  });

  it("should return single event", async () => {
    await nftContract.mintToSelf({
      name: "Test1",
    });

    const events = await nftContract.events.getEvents("TokensMinted");
    expect(events.length).to.be.equal(1);
  });

  it("should return multiple events", async () => {
    await nftContract.mintToSelf({
      name: "Test1",
    });

    await nftContract.transfer(samWallet.address, 0);

    const events = await nftContract.events.getAllEvents();
    expect(events.filter((e) => e.eventName === "Transfer").length).to.be.equal(
      2,
    );
    expect(
      events.filter((e) => e.eventName === "TokensMinted").length,
    ).to.be.equal(1);
  });
});
