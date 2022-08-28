import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sdk, signers } from "./before-setup";

import { assert } from "chai";
import { BigNumber } from "ethers";
import { EditionMetadataInput, Pack, Edition } from "../src";

global.fetch = require("cross-fetch");

describe("Pack Contract", async () => {
  let packContract: Pack;
  let bundleContract: Edition;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  const createBundles = async () => {
    const batch: EditionMetadataInput[] = [];
    for (let i = 0; i < 5; i++) {
      batch.push({
        metadata: {
          name: `NFT ${i}`,
        },
        supply: BigNumber.from(1000),
      });
    }

    await bundleContract.mintBatch(batch);
  };

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    packContract = sdk.getPack(
      await sdk.deployer.deployBuiltInContract(Pack.contractType, {
        name: "Pack Contract",
        seller_fee_basis_points: 1000,
      }),
    );

    bundleContract = sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(Edition.contractType, {
        name: "NFT Contract",
        seller_fee_basis_points: 1000,
        primary_sale_recipient: adminWallet.address,
      }),
    );

    await bundleContract.setApprovalForAll(packContract.getAddress(), true);
    await createBundles();
  });

  const createPacks = async () => {
    const packOne = await packContract.create({
      erc1155Rewards: [
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "0",
          quantityPerReward: 1,
          totalRewards: 50,
        },
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "1",
          quantityPerReward: 1,
          totalRewards: 50,
        },
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "2",
          quantityPerReward: 1,
          totalRewards: 50,
        },
      ],
      packMetadata: {
        name: "Pack",
      },
    });

    const packTwo = await packContract.create({
      erc1155Rewards: [
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "0",
          quantityPerReward: 1,
          totalRewards: 50,
        },
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "1",
          quantityPerReward: 1,
          totalRewards: 50,
        },
        {
          contractAddress: bundleContract.getAddress(),
          tokenId: "2",
          quantityPerReward: 1,
          totalRewards: 50,
        },
      ],
      packMetadata: {
        name: "Pack",
      },
      rewardsPerPack: 2,
    });

    return [packOne, packTwo];
  };

  it("should allow you to create a batch of packs", async () => {
    const [pack] = await createPacks();
    const data = await pack.data();

    assert.equal(data.metadata.name, "Pack");
  });

  it("should return the correct rewards", async () => {
    const [pack] = await createPacks();
    const rewards = await packContract.getPackContents(pack.id);

    const first = rewards.erc1155Rewards.find(
      (reward) =>
        reward.tokenId === "0" &&
        reward.totalRewards === "50" &&
        reward.quantityPerReward === "1",
    );

    const second = rewards.erc1155Rewards.find(
      (reward) =>
        reward.tokenId === "1" &&
        reward.totalRewards === "50" &&
        reward.quantityPerReward === "1",
    );

    const third = rewards.erc1155Rewards.find(
      (reward) =>
        reward.tokenId === "2" &&
        reward.totalRewards === "50" &&
        reward.quantityPerReward === "1",
    );

    assert.isDefined(first, "First NFT not found");
    assert.isDefined(second, "Second NFT not found");
    assert.isDefined(third, "Third NFT not found");
  });

  it("should return correct pack supply", async () => {
    const [packOne, packTwo] = await createPacks();
    const balanceOne = await packContract.balance(packOne.id);
    const balanceTwo = await packContract.balance(packTwo.id);

    assert.equal("150", balanceOne.toString());
    assert.equal("75", balanceTwo.toString());
  });

  it("pack open returns valid reward", async () => {
    const [packOne, packTwo] = await createPacks();
    let result = await packContract.open(packOne.id);
    assert.equal(result.erc1155Rewards?.length, 1);
    result = await packContract.open(packTwo.id);
    assert.equal(result.erc1155Rewards?.length, 2);
  });

  it("get owned returns pack metadata and balances", async () => {
    await createPacks();

    let adminOwned = await packContract.getOwned();
    assert.equal(adminOwned.length, 2);
    assert.equal(adminOwned[0].quantityOwned.toString(), "150");
    assert.equal(adminOwned[1].quantityOwned.toString(), "75");

    await packContract.transfer(samWallet.address, "0", BigNumber.from(50));
    const samOwned = await packContract.getOwned(samWallet.address);
    assert.equal(samOwned.length, 1);
    assert.equal(samOwned[0].quantityOwned.toString(), "50");

    adminOwned = await packContract.getOwned();
    assert.equal(adminOwned[0].quantityOwned.toString(), "100");
  });
});
