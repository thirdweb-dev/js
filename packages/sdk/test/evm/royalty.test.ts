import { Edition, EditionInitializer } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Royalties", async () => {
  let bundleContract: Edition;

  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    bundleContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
        {
          name: "NFT Contract",
          primary_sale_recipient: adminWallet.address,
          fee_recipient: adminWallet.address,
          seller_fee_basis_points: 1000,
        },
      ),
    );

    await bundleContract.mint({
      metadata: {
        name: "Cool NFT",
      },
      supply: 100,
    });
  });

  it("should return default royalty", async () => {
    const info = await bundleContract.royalties.getDefaultRoyaltyInfo();
    expect(info.fee_recipient).to.eq(adminWallet.address);
    expect(info.seller_fee_basis_points).to.eq(1000);
  });

  it("should set default royalty", async () => {
    await bundleContract.royalties.setDefaultRoyaltyInfo({
      fee_recipient: samWallet.address,
      seller_fee_basis_points: 500,
    });
    const info = await bundleContract.royalties.getDefaultRoyaltyInfo();
    expect(info.fee_recipient).to.eq(samWallet.address);
    expect(info.seller_fee_basis_points).to.eq(500);
  });

  it("should return per token royalty", async () => {
    const info = await bundleContract.royalties.getTokenRoyaltyInfo("0");
    expect(info.fee_recipient).to.eq(adminWallet.address);
    expect(info.seller_fee_basis_points).to.eq(1000);
  });

  it("should set per token royalty", async () => {
    await bundleContract.royalties.setTokenRoyaltyInfo("0", {
      fee_recipient: samWallet.address,
      seller_fee_basis_points: 500,
    });
    const info = await bundleContract.royalties.getTokenRoyaltyInfo("0");
    expect(info.fee_recipient).to.eq(samWallet.address);
    expect(info.seller_fee_basis_points).to.eq(500);
  });
});
