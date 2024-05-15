import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { signers, sdk } from "./before-setup";
import { assert, expect } from "chai";
import { AddressZero } from "../../src/evm/constants/addresses/AddressZero";

describe("Validate address for `platform_fee_recipient` and `primary_sale_recipient`", async () => {
  let adminWallet: SignerWithAddress;

  before(async () => {
    [adminWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("platform_fee_recipient should be `signerAddress` if not specified when deploy", async () => {
    const marketplaceContractAddress = await sdk.deployer.deployBuiltInContract(
      "marketplace-v3",
      {
        name: "marketplace",
      },
    );
    const marketplaceContract = await sdk.getContract(
      marketplaceContractAddress,
    );
    const signerAddress = await sdk.getSigner()?.getAddress();
    const platformFeeInfo = await marketplaceContract.platformFees.get();
    assert.strictEqual(platformFeeInfo.platform_fee_recipient, signerAddress);
  });

  it("platform_fee_recipient should be `signerAddress` if set to AddressZero when deploy", async () => {
    const marketplaceContractAddress = await sdk.deployer.deployBuiltInContract(
      "marketplace-v3",
      {
        name: "marketplace",
        platform_fee_recipient: AddressZero,
      },
    );
    const marketplaceContract = await sdk.getContract(
      marketplaceContractAddress,
    );
    const signerAddress = await sdk.getSigner()?.getAddress();
    const platformFeeInfo = await marketplaceContract.platformFees.get();
    assert.strictEqual(platformFeeInfo.platform_fee_recipient, signerAddress);
  });

  it("primary_sale_recipient should be `signerAddress` if not specified when deploy", async () => {
    const nftDropAddress = await sdk.deployer.deployBuiltInContract(
      "nft-drop",
      {
        name: "nftDrop",
      },
    );
    const nftDropContract = await sdk.getContract(nftDropAddress);
    const primarySaleRecipient = await nftDropContract.sales.getRecipient();
    const signerAddress = await sdk.getSigner()?.getAddress();
    assert.strictEqual(primarySaleRecipient, signerAddress);
  });

  it("primary_sale_recipient should be `signerAddress` if set to AddressZero when deploy", async () => {
    const nftDropAddress = await sdk.deployer.deployBuiltInContract(
      "nft-drop",
      {
        name: "nftDrop",
        primary_sale_recipient: AddressZero,
      },
    );
    const nftDropContract = await sdk.getContract(nftDropAddress);
    const primarySaleRecipient = await nftDropContract.sales.getRecipient();
    const signerAddress = await sdk.getSigner()?.getAddress();
    assert.strictEqual(primarySaleRecipient, signerAddress);
  });
});
