import { ThirdwebSDK } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "ethers";

describe("Transactions", async () => {
  let adminWallet: SignerWithAddress;
  let samWallet: SignerWithAddress;

  before(async () => {
    [adminWallet, samWallet] = signers;
  });

  it("Should succesfully prepare and execute a transaction", async () => {
    const address = await sdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = await sdk.getContract(address, "nft-collection");

    let isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(false);

    const tx = await contract.prepare("setApprovalForAll", [
      samWallet.address,
      true,
    ]);
    await tx.execute();

    isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(true);
  });

  it.skip("Should successfully sign and send transaction", async () => {
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      adminWallet.provider,
    );
    const signerSdk = new ThirdwebSDK(wallet, {
      secretKey: process.env.TW_SECRET_KEY,
    });
    const address = await signerSdk.deployer.deployNFTCollection({
      name: "NFT",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = await signerSdk.getContract(address, "nft-collection");

    let isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(false);

    const tx = await contract.setApprovalForAll.prepare(
      samWallet.address,
      true,
    );
    const signedTx = await tx.sign();
    await sdk.getProvider().sendTransaction(signedTx);

    isApproved = await contract.isApproved(
      adminWallet.address,
      samWallet.address,
    );
    expect(isApproved).to.equal(true);
  });
});
